import rss from '@astrojs/rss'
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { loadRenderers } from 'astro:container'
import { render } from 'astro:content'
import { SITE_NAME } from '@/config'
import { getPosts, getPostSnippet } from '@/config/blog'

export async function GET(context: APIContext) {
	const posts = await getPosts()
	const renderers = await loadRenderers([getMDXRenderer()])
	const container = await AstroContainer.create({ renderers })

	const items = await Promise.all(
		posts.map(async (post) => {
			const link = new URL(`/blog/${post.id}`, context.site).href
			const { Content } = await render(post)
			const html = await container.renderToString(Content)

			return {
				title: post.data.title,
				pubDate: post.data.date,
				description: getPostSnippet(post),
				// Feed readers resolve links against the feed, not the post, so make them absolute
				content: html.replace(/(href|src)="([#/][^"]*)"/g, (_, attr, path) => {
					const url = path.startsWith('#') ? `${link}${path}` : new URL(path, context.site).href
					return `${attr}="${url}"`
				}),
				link,
			}
		}),
	)

	return rss({
		title: `${SITE_NAME}'s Blog`,
		description: "Notes on software, open source, and whatever else I'm working on",
		site: context.site!,
		items,
	})
}
