/**
 * Handles the contact form. Everything else is served from the static build, and only /api/* reaches this Worker
 * https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
 */
interface Env {
	ASSETS: Fetcher
	CONTACT_EMAIL: SendEmail
	// A verified Email Routing destination, kept as a secret so the real address stays out of the repo
	CONTACT_TO: string
}

// Must be an address on the zone that has Email Routing enabled
const FROM = {
	name: 'violetcaulfield.com',
	email: 'contact@violetcaulfield.com',
}

const LIMITS = { name: 100, email: 254, message: 5000 }

type Result = { ok: true } | { ok: false; error: string }

async function handleContact(request: Request, env: Env): Promise<Result> {
	const form = await request.formData()
	const field = (key: string) => {
		const value = form.get(key)
		return typeof value === 'string' ? value.trim() : ''
	}

	// Bots fill in every field, including the one hidden from people
	if (field('website')) return { ok: true }

	const name = field('name')
	const email = field('email')
	const message = field('message')

	if (!name || !email || !message) {
		return { ok: false, error: 'Please fill in your name, email, and message.' }
	}
	if (
		name.length > LIMITS.name ||
		email.length > LIMITS.email ||
		message.length > LIMITS.message
	) {
		return { ok: false, error: 'One of those fields is too long.' }
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { ok: false, error: 'That email address doesn’t look right.' }
	}

	// Line breaks in a name would end up in the subject header
	const sender = name.replace(/[\r\n]+/g, ' ')

	await env.CONTACT_EMAIL.send({
		from: FROM,
		to: env.CONTACT_TO,
		replyTo: { name: sender, email },
		subject: `Contact form: ${sender}`,
		text: `From: ${sender} <${email}>\n\n${message}`,
	})

	return { ok: true }
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url)
		if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request)
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: { Allow: 'POST' },
			})
		}

		let result: Result
		try {
			result = await handleContact(request, env)
		} catch (error) {
			console.error('Contact form failed', error)
			result = {
				ok: false,
				error: 'Something went wrong sending your message.',
			}
		}

		// The page's script asks for JSON; without JavaScript the browser posts the form and follows a redirect back
		if (request.headers.get('Accept')?.includes('application/json')) {
			return Response.json(result, { status: result.ok ? 200 : 400 })
		}
		const back = new URL('/contact', url)
		back.searchParams.set('status', result.ok ? 'sent' : 'error')
		return Response.redirect(back.toString(), 303)
	},
} satisfies ExportedHandler<Env>
