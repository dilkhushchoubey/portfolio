'use client';

import React from 'react';
import { Photograph } from '@/types/photography';
import EditorialGallery from '@/components/EditorialGallery';

interface StillsClientProps {
  photos: Photograph[];
}

export default function StillsClient({ photos }: StillsClientProps) {
  return <EditorialGallery photos={photos} />;
}
