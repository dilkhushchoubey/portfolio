import type { Metadata } from 'next';
import { getPortraitsPhotographs } from '@/data/portraits';
import PortraitsClient from './PortraitsClient';

export const metadata: Metadata = {
  title: 'Portraits',
  description: 'Individual portrait photographs by Dilkhush Choubey.',
};

export default function PortraitsPage() {
  const portraits = getPortraitsPhotographs();

  return <PortraitsClient photos={portraits} />;
}

