'use client';

import dynamic from 'next/dynamic';
import { Loading } from '@/components/Loading';


const PublicHomePage = dynamic(
  () => import('@/components/PublicHomePage').then(mod => ({ default: mod.PublicHomePage })),
  {
    ssr: false,
    loading: () => <Loading text="Sayfa yükleniyor..." />
  }
);

export default function Home() {
  return <PublicHomePage />;
}