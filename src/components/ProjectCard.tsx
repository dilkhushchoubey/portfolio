import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/photography';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const ratioClass = project.coverImage.aspectRatio === '4:3' ? styles.ratio4x3 : styles.ratio3x2;

  return (
    <article className={styles.card}>
      <Link href={`/work/${project.slug}`} aria-label={`View project: ${project.title}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          <span className={styles.meta}>
            {project.location} · {project.year}
          </span>
        </div>
        <div className={`${styles.imageFrame} ${ratioClass}`}>
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            priority={priority}
            className={styles.image}
            sizes="(max-width: 900px) 100vw, 1200px"
          />
        </div>
      </Link>
    </article>
  );
}
