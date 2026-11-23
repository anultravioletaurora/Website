import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * The blog collection defines the structure and metadata for blog posts.
 *
 * Each blog post must have a title and a date, and can optionally have a description and an updated date.
 *
 * A post's file name is its URL: `2026-11-09-hello-world.mdx` is served at /blog/2026-11-09-hello-world.
 *
 * Name posts `<date>-<slug>.mdx`, with a few words from the title as the slug, so the URL says what the post is about.
 * Renaming a published post breaks its URL, so add a redirect to public/_redirects when you do.
 */
const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		// Set when a post is meaningfully revised; used for the sitemap and structured data
		updated: z.coerce.date().optional(),
		// Shown on /blog and in the RSS feed; falls back to the post's first paragraph
		description: z.string().optional(),
	}),
})

export const collections = { blog }
