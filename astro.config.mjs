// @ts-check
import { readdirSync, readFileSync } from 'node:fs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

const BLOG_DIR = './src/content/blog'

/**
 * Extracts the value of a frontmatter field from the source string, if it exists and returns it as a string
 * 
 * @param {string} name  The name of the frontmatter field to extract
 * @param {string} source The source string containing the frontmatter
 * @returns {string | undefined} The value of the frontmatter field, or undefined if it doesn't exist
 */
function fieldFilter(name, source) {
	// Skip optional YAML quotes, so `date: "2026-11-19"` reads the same as `date: 2026-11-19`
	return source.match(new RegExp(`^${name}:\\s*["']?([^\\s"']+)`, 'm'))?.[1]
}

// Content collections aren't available in the config, so read each post's dates straight from its frontmatter
const postDates = new Map(
	readdirSync(BLOG_DIR)
		.filter((file) => /\.mdx?$/.test(file))
		.map((file) => {
			const source = readFileSync(`${BLOG_DIR}/${file}`, 'utf8')
			const field = (/** @type {string} */ name) => fieldFilter(name, source)
			return [file.replace(/\.mdx?$/, ''), new Date(field('updated') ?? field('date') ?? 0)]
		}),
)
const latestPost = new Date(Math.max(0, ...[...postDates.values()].map((date) => date.getTime())))

export default defineConfig({
	site: 'https://violetcaulfield.com',
	server: { port: 3000 },
	// Emit /blog.html instead of /blog/index.html so Cloudflare serves /blog without redirecting to /blog/
	build: { format: 'file' },
	trailingSlash: 'never',
	integrations: [
		mdx(),
		sitemap({
			// Tells search engines when to recrawl: a post when it changes, and the pages that list posts when a new one goes up
			serialize(item) {
				const { pathname } = new URL(item.url)
				const post = pathname.match(/^\/blog\/(.+)$/)?.[1]
				const lastmod = post ? postDates.get(post) : ['/', '/blog'].includes(pathname) ? latestPost : undefined
				return lastmod && lastmod.getTime() > 0 ? { ...item, lastmod: lastmod.toISOString() } : item
			},
		}),
	],
})
