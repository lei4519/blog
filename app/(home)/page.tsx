import { source } from '@/lib/source';
import Link from 'next/link';
import Redirect from './redirect';

export default function HomePage() {
  const pages = source.getPages();

  return <nav className='hidden'>
    {pages.map((page) => (
      <Link key={page.url} href={page.url} className='block'>{page.data.title}</Link>
    ))}
    <Redirect />
  </nav>;
}
