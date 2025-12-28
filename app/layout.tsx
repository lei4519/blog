import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
});

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
            enabled: false
          }}
        >{children}</RootProvider>
      </body>
    </html>
  );
}
