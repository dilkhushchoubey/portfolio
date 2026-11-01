import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects, getProjectCover } from '@/data/projects';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Photographic projects and series by Dilkhush Choubey.',
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className={styles.container}>
      <section className={styles.projectsList} aria-label="Photographic Projects">
        {projects.map((project, idx) => {
          const cover = getProjectCover(project);
          const shortDescription =
            project.subtitle ||
            (project.statement && project.statement.length > 0 ? project.statement[0] : '');

          return (
            <article key={project.id} className={styles.projectEntry}>
              {/* Left: Project Cover Photograph */}
              <Link
                href={`/work/${project.slug}`}
                className={styles.coverLink}
                aria-label={`View project: ${project.title}`}
              >
                <div className={styles.imageFrame}>
                  <Image
                    src={cover.src}
                    alt={cover.alt || project.title}
                    width={cover.width}
                    height={cover.height}
                    priority={idx === 0}
                    className={styles.coverImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 52vw, 680px"
                  />
                </div>
              </Link>

              {/* Right: Project Information */}
              <div className={styles.projectInfo}>
                <h2 className={styles.projectTitle}>
                  <Link href={`/work/${project.slug}`} className={styles.titleLink}>
                    {project.title}
                  </Link>
                </h2>

                {shortDescription && (
                  <p className={styles.projectDescription}>{shortDescription}</p>
                )}

                <div className={styles.actionRow}>
                  <Link
                    href={`/work/${project.slug}`}
                    className={styles.readMoreLink}
                    aria-label={`Read more about ${project.title}`}
                  >
                    <span>Read more</span>
                    <span className={styles.readMoreArrow} aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

