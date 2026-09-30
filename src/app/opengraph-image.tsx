import { ImageResponse } from 'next/og';
import { getAllPosts } from '@/lib/blog/loader';
import { SiteCard } from './_og/cards';
import { OG, ogFonts } from './_og/fonts';

export const alt = 'Opeyemi Bangkok: Web3 infrastructure, African fintech and developer education';
export const size = OG.size;
export const contentType = 'image/png';

export default async function Image() {
  const posts = await getAllPosts(true);
  return new ImageResponse(<SiteCard issue={posts.length} />, { ...size, fonts: await ogFonts() });
}
