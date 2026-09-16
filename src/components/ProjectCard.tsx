import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/photography';
import { getProjectCover } from '@/data/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const cover = getProjectCover(project);

  return (
    <article className={styles.card}>
      <Link href={`/work/${project.slug}`} aria-label={`View project: ${project.title}`}>
        <header className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          <span className={styles.meta}>
            {project.location ? `${project.location} · ` : ''}{project.year}
          </span>
        </header>

        <div
          className={styles.imageFrame}
          style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority={priority}
            className={styles.image}
            sizes="(max-width: 900px) 100vw, 1360px"
          />
        </div>
      </Link>
    </article>
  );
}
