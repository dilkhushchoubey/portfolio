'use client';

import React from 'react';
import { Photograph } from '@/types/photography';
import EditorialGallery from '@/components/EditorialGallery';

interface PortraitsClientProps {
  photos: Photograph[];
}

export default function PortraitsClient({ photos }: PortraitsClientProps) {
  return <EditorialGallery photos={photos} />;
}
