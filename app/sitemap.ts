import { source } from '@/lib/source';
import type { MetadataRoute } from 'next'

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = source.getPages();
	const siteUrl = 'https://lei4519.github.io/blog';

	// 添加首页
	const sitemapEntries: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${siteUrl}/docs`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
	];

	// 添加所有文档页面
	for (const page of pages) {
		sitemapEntries.push({
			url: `${siteUrl}${page.url}`,
			lastModified: page.data.created,
			changeFrequency: 'monthly',
			priority: 0.7,
		});
	}

	return sitemapEntries;
}