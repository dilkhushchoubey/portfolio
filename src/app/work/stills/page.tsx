import type { Metadata } from 'next';
import { getStillsPhotographs } from '@/data/stills';
import StillsClient from './StillsClient';

export const metadata: Metadata = {
  title: 'Stills',
  description: 'Standalone photographic stills and studies by Dilkhush Choubey.',
};

export default function StillsPage() {
  const stills = getStillsPhotographs();

  return <StillsClient photos={stills} />;
}

