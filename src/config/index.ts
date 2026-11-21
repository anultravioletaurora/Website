import type { Link } from '../types'
import {
	mdiEmailOutline,
	mdiGithub,
	mdiLinkedin,
	mdiMastodon,
	mdiPost,
	mdiJellyfish,
	mdiReddit,
	mdiRss,
	mdiButterflyOutline,
	mdiPatreon,
} from '@mdi/js'

export const SITE_NAME = 'Violet Caulfield'
export const SITE_DESCRIPTION =
	'Software engineer from Wisconsin, and the creator of Jellify.'

// Forwarded to a personal inbox with Cloudflare Email Routing, so the real address stays private
export const EMAIL = 'hello@violetcaulfield.com'

export const navLinks: Link[] = [
	{
		label: 'Blog',
		icon: mdiPost,
		href: '/blog',
	},
	{
		label: 'Contact',
		icon: mdiEmailOutline,
		href: '/contact',
	},
]

// Shown in the header, footer, and on the contact page. `rel='me'` on these lets Mastodon verify the site
export const socialLinks: Link[] = [
	{
		label: 'GitHub',
		icon: mdiGithub,
		href: 'https://github.com/anultravioletaurora',
		description: 'The stuff I build',
	},
	{
		label: 'LinkedIn',
		icon: mdiLinkedin,
		href: 'https://www.linkedin.com/in/violet-caulfield-0a422b132',
		description: 'The stuff I do',
	},
	{
		label: 'Bluesky',
		icon: mdiButterflyOutline,
		href: 'https://bsky.app/profile/violexene.bsky.social',
		description: '@violexene.bsky.social',
	},
	{
		label: 'Mastodon',
		icon: mdiMastodon,
		href: 'https://mastodon.social/@violexene',
		description: '@violexene@mastodon.social',
	},
	{
		label: 'Reddit',
		icon: mdiReddit,
		href: 'https://www.reddit.com/user/anultravioletaurora',
		description: 'u/anultravioletaurora',
	},
]

// Shown in the Sponsor card at the end of blog posts
export const sponsorLinks: Link[] = [
	{
		label: 'Sponsors',
		icon: mdiGithub,
		href: 'https://github.com/sponsors/anultravioletaurora',
	},
	{
		label: 'Patreon',
		icon: mdiPatreon,
		href: 'https://www.patreon.com/anultravioletaurora',
	},
]

// Points at the contact form rather than a mailto link
export const emailLink = {
	label: 'Email',
	icon: mdiEmailOutline,
	href: '/contact',
	description: EMAIL,
} satisfies Link

export const rssLink = {
	label: 'RSS',
	icon: mdiRss,
	href: '/blog/rss.xml',
} satisfies Link

export const projects: Link[] = [
	{
		label: 'Jellify',
		icon: mdiJellyfish,
		href: 'https://jellify.app',
		description:
			'A free and open source music player for Jellyfin, available on iOS and Android.',
	},
]
