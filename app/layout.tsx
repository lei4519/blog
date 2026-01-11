import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import SearchDialog from '@/components/search';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const siteUrl = 'https://lei4519.github.io/blog';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lex's Blog",
    template: "%s | Lex's Blog",
  },
  description: '分享、记录技术与生活',
  keywords: ['blog', 'frontend', 'fe', 'rust', 'cycling', '前端', '博客'],
  authors: [{ name: 'lei4519', url: 'https://github.com/lei4519' }],
  creator: 'lei4519',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: "Lex's Blog",
    title: "Lex's Blog",
    description: '分享、记录技术与生活',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning suppressContentEditableWarning>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F1R706JR1D"
        strategy="afterInteractive"
      ></Script>
      <Script
        strategy="afterInteractive"
      >
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-F1R706JR1D');`}

      </Script>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            SearchDialog,
          }}
        >{children}</RootProvider>
      </body>
    </html>
  );
}
