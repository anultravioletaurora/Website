/**
 * Generates every image derived from the profile photo (src/assets/avatar.jpg, a square crop):
 * - public/avatar.webp, the circular photo in the header and on the home page (the circle is CSS)
 * - public/favicon.png, a circular favicon with a transparent background
 * - public/apple-touch-icon.png, the icon iOS uses when the site is added to the home screen (iOS rounds it)
 * - public/og.png, the 1200x630 card shown when a page is shared on social media
 *
 * Run with `bun run og-image` after replacing the photo. sharp drops the photo's metadata (EXIF, GPS) on output.
 */
import sharp from 'sharp'

const PHOTO = 'src/assets/avatar.jpg'

const circleMask = (size) =>
	Buffer.from(
		`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`,
	)

async function circularPhoto(size) {
	return sharp(PHOTO)
		.resize(size, size)
		.composite([{ input: circleMask(size), blend: 'dest-in' }])
		.png()
		.toBuffer()
}

// 2x the largest display size (160px in the hero)
await sharp(PHOTO)
	.resize(320, 320)
	.webp({ quality: 82 })
	.toFile('public/avatar.webp')

await sharp(await circularPhoto(64))
	.png({ compressionLevel: 9 })
	.toFile('public/favicon.png')

await sharp(PHOTO)
	.resize(180, 180)
	.png({ compressionLevel: 9 })
	.toFile('public/apple-touch-icon.png')

const WIDTH = 1200
const HEIGHT = 630
const PHOTO_SIZE = 300
const RING = 8

const background = Buffer.from(`
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
	<!-- Gradient ring behind the photo, matching the hero -->
	<circle cx="${WIDTH - 110 - PHOTO_SIZE / 2}" cy="${HEIGHT / 2}" r="${PHOTO_SIZE / 2 + RING}" fill="url(#accent)" />
	<g font-family="Allo, Helvetica Neue, Helvetica, Arial, sans-serif" fill="#ffffff">
		<text x="80" y="250" font-size="40" font-weight="600" fill="#c9c6d6">Hi, I'm</text>
		<text x="80" y="340" font-size="88" font-weight="800" fill="url(#accent)">Violet Caulfield</text>
		<text x="80" y="420" font-size="32" fill="#c9c6d6">Software engineer</text>
		<text x="80" y="510" font-size="28" font-weight="600" fill="#887bff">violetcaulfield.com</text>
	</g>
</svg>`)

await sharp(background)
	.composite([
		{
			input: await circularPhoto(PHOTO_SIZE),
			left: WIDTH - 110 - PHOTO_SIZE,
			top: (HEIGHT - PHOTO_SIZE) / 2,
		},
	])
	.png({ compressionLevel: 9 })
	.toFile('public/og.png')
