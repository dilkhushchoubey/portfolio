import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/data/projects';
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
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.subtitle || project.statement[0],
    openGraph: {
      title: `${project.title} — Dilkhush Choubey`,
      description: project.subtitle || project.statement[0],
      images: [{ url: project.coverImage.src }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <article className={styles.article}>
      <Link href="/work" className={styles.backLink}>
        &larr; Back to Work Index
      </Link>

      <header className={styles.header}>
        <div className={styles.metaRow}>
          <span className={styles.kindBadge}>
            {project.kind === 'series' ? 'Short Series' : 'Major Project'}
          </span>
          <span className={styles.metaDetails}>
            {project.location} · {project.year}
          </span>
        </div>

        <h1 className={styles.title}>{project.title}</h1>

        {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}

        <div className={styles.statementBlock}>
          {project.statement.map((para, index) => (
            <p key={index} className={styles.statementPara}>
              {para}
            </p>
          ))}
        </div>
      </header>

      <section className={styles.gallerySection} aria-label="Photographs in this Project">
        <div className={styles.galleryHeader}>
          <span className="meta-stamp">Plates ({project.photographs.length})</span>
          <span className="meta-stamp">3:2 &amp; 4:3 Original Compositions</span>
        </div>

        <div className={styles.galleryList}>
          {project.photographs.map((photo, index) => (
            <PhotographViewer key={photo.id} photo={photo} priority={index === 0} />
          ))}
        </div>
      </section>

      <nav className={styles.footerNav} aria-label="Adjacent Projects">
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
