import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectCover,
  getAdjacentProjects,
} from '@/data/projects';
import PhotographViewer from '@/components/PhotographViewer';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Work Not Found',
    };
  }

  const cover = getProjectCover(project);
  const description =
    project.subtitle ||
    (project.statement && project.statement.length > 0
      ? project.statement[0]
      : `${project.title} by Dilkhush Choubey`);

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} — Dilkhush Choubey`,
      description,
      images: [{ url: cover.src }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prevProject, nextProject } = getAdjacentProjects(project.slug);

  return (
    <article className={styles.article}>
      <Link href="/work" className={styles.backLink}>
        &larr; Back to Work
      </Link>

      <header className={styles.header}>
        <div className={styles.metaRow}>
          <span className={styles.kindBadge}>
            {project.kind === 'series' ? 'Series' : 'Project'}
          </span>
          <span className={styles.metaDetails}>
            {project.location ? `${project.location} · ` : ''}
            {project.year}
          </span>
        </div>

        <h1 className={styles.title}>{project.title}</h1>

        {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}

        {project.statement && project.statement.length > 0 && (
          <div className={styles.statementBlock}>
            {project.statement.map((para, index) => (
              <p key={index} className={styles.statementPara}>
                {para}
              </p>
            ))}
          </div>
        )}
      </header>

      <section className={styles.gallerySection} aria-label="Photographs in this Work">
        <div className={styles.galleryHeader}>
          <span className="meta-stamp">Photographs ({project.photographs.length})</span>
          <span className="meta-stamp">Original Compositions</span>
        </div>

        <div className={styles.galleryList}>
          {project.photographs.map((photo, index) => (
            <PhotographViewer key={photo.id} photo={photo} priority={index === 0} />
          ))}
        </div>
      </section>

      <nav className={styles.footerNav} aria-label="Adjacent Works">
        {prevProject ? (
          <Link href={`/work/${prevProject.slug}`} className={styles.navPrev}>
            &larr; {prevProject.title}
          </Link>
        ) : (
          <span />
        )}

        {nextProject ? (
          <Link href={`/work/${nextProject.slug}`} className={styles.navNext}>
            {nextProject.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
