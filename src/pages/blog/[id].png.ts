/**
 * The 1200x630 link preview card for each post, built alongside it at /blog/<id>.png.
 *
 * Uses the same background as public/og.png (see scripts/og-image.mjs), with the post's title in place of the intro.
 */
import type { APIContext } from 'astro'
import sharp from 'sharp'
import { SITE_NAME } from '@/config'
import { formatPostDate, getPosts, type Post } from '@/config/blog'

const WIDTH = 1200
const HEIGHT = 630
const PHOTO_SIZE = 72
const RING = 4
const TITLE_SIZE = 76
const TITLE_LINE_HEIGHT = 88
// Roughly how many characters of the title font fit across the card
const MAX_LINE_LENGTH = 24
const MAX_LINES = 3

export async function getStaticPaths() {
	const posts = await getPosts()
	return posts.map((post) => ({ params: { id: post.id }, props: { post } }))
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// SVG text doesn't wrap, so break the title into lines by word, with an ellipsis if it runs past MAX_LINES
function wrap(text: string): string[] {
	const lines: string[] = []
	for (const word of text.split(/\s+/)) {
		const last = lines.at(-1)
		if (last !== undefined && `${last} ${word}`.length <= MAX_LINE_LENGTH) lines[lines.length - 1] = `${last} ${word}`
		else lines.push(word)
	}
	if (lines.length <= MAX_LINES) return lines
	return [...lines.slice(0, MAX_LINES - 1), `${lines[MAX_LINES - 1]}…`]
}

const circleMask = (size: number) => Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`)

export async function GET({ props }: APIContext) {
	const { post } = props as { post: Post }
	const lines = wrap(post.data.title)
	// Center the title block vertically between the header and the footer
	const titleTop = HEIGHT / 2 - ((lines.length - 1) * TITLE_LINE_HEIGHT) / 2 + TITLE_SIZE / 3

	const card = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<radialGradient id="glow" cx="85%" cy="15%" r="85%">
			<stop offset="0%" stop-color="#4b0fd6" stop-opacity="0.6" />
			<stop offset="100%" stop-color="#19181c" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="pink" cx="100%" cy="100%" r="60%">
			<stop offset="0%" stop-color="#f76ea9" stop-opacity="0.3" />
			<stop offset="100%" stop-color="#19181c" stop-opacity="0" />
		</radialGradient>
		<linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#887bff" />
			<stop offset="1" stop-color="#f76ea9" />
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="#19181c" />
	<rect width="100%" height="100%" fill="url(#glow)" />
	<rect width="100%" height="100%" fill="url(#pink)" />
	<circle cx="${80 + PHOTO_SIZE / 2}" cy="${80 + PHOTO_SIZE / 2}" r="${PHOTO_SIZE / 2 + RING}" fill="url(#accent)" />
	<g font-family="Allo, Helvetica Neue, Helvetica, Arial, sans-serif" fill="#ffffff">
		<text x="${80 + PHOTO_SIZE + 28}" y="${80 + PHOTO_SIZE / 2 + 12}" font-size="34" font-weight="700">${escape(SITE_NAME)}</text>
		<text font-size="${TITLE_SIZE}" font-weight="800" fill="url(#accent)">
			${lines.map((line, i) => `<tspan x="80" y="${titleTop + i * TITLE_LINE_HEIGHT}">${escape(line)}</tspan>`).join('')}
		</text>
		<text x="80" y="${HEIGHT - 80}" font-size="28" font-weight="600" fill="#c9c6d6">${formatPostDate(post.data.date)}</text>
		<text x="${WIDTH - 80}" y="${HEIGHT - 80}" font-size="28" font-weight="600" fill="#887bff" text-anchor="end">violetcaulfield.com/blog</text>
	</g>
</svg>`)

	const photo = await sharp('src/assets/avatar.jpg')
		.resize(PHOTO_SIZE, PHOTO_SIZE)
		.composite([{ input: circleMask(PHOTO_SIZE), blend: 'dest-in' }])
		.png()
		.toBuffer()

	const png = await sharp(card)
		.composite([{ input: photo, left: 80, top: 80 }])
		.png({ compressionLevel: 9 })
		.toBuffer()

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } })
}
