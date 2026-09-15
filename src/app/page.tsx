import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import { getAllProjects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <div className={styles.homeContainer}>
      <section className={styles.identitySection} aria-label="Introduction">
        <p className={styles.introPrefix}>
          {siteConfig.profession} — {siteConfig.location}
        </p>
        <p className={styles.statement}>{siteConfig.shortBio}</p>
        <Link href="/work" className={styles.viewWorkLink}>
          View Work &rarr;
        </Link>
      </section>

      <section aria-label="Selected Work">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Selected Work</h2>
          <span className="meta-stamp">{projects.length} Works</span>
        </div>

        <div className={styles.projectsList}>
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} priority={idx === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
