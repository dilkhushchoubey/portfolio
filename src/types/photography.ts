export type AspectRatio = '3:2' | '4:3' | '16:9' | '1:1';

export type ProjectKind = 'project' | 'series';

export interface PhotographMetadata {
  location?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface Photograph {
  id: string;
  src: string;
  alt: string;
  title?: string;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  metadata?: PhotographMetadata;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  kind: ProjectKind;
  year: string;
  location: string;
  statement: string[];
  coverImage: Photograph;
  photographs: Photograph[];
  featured?: boolean;
  order: number;
}

export interface SiteSocialLinks {
  instagram: string;
  instagramHandle: string;
  email: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  profession: string;
  location: string;
  shortBio: string;
  statement: string[];
  social: SiteSocialLinks;
}
