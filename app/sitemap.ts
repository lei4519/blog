import { source } from '@/lib/source';
import type { MetadataRoute } from 'next'

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = source.getPages();

	return pages.map((page) => ({
		url: `https://lei4519.github.io/blog${page.url}`,
		title: page.data.title,
		lastModified: page.data.created,
		changeFrequency: 'monthly',
	}));
}