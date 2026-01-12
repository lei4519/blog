import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import Script from 'next/script';
import CommentsScript from './script';
import GitHubStar from './star';
import { TagLink } from './tag-link';

function DocsTags(props: { tags: string[] }) {
  if (props.tags.length === 0) return null;
  return <ul className="flex gap-2 ">
    {props.tags.map((tag) => (
      <li key={tag}>
        <TagLink tag={tag} />
      </li>
    ))}
  </ul>;
}

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {
        page.data.title !== page.data.description && (
          <DocsDescription className='mb-0'>{page.data.description}</DocsDescription>
        )
      }
      <div className='text-fd-muted-foreground mb-4 flex items-center gap-2 justify-between flex-wrap'>
        <DocsTags tags={page.data.tags || []} />
        <time className='font-mono'>{page.data.created?.toLocaleDateString()}</time>
      </div>

      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>


      <GitHubStar />
      <CommentsScript issueNumber={page.data.issue} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const siteUrl = 'https://lei4519.github.io/blog';
  const pageUrl = `${siteUrl}${page.url}`;
  const imageUrl = getPageImage(page).url;

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.tags,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          alt: page.data.title,
        },
      ],
      publishedTime: page.data.created?.toISOString(),
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
