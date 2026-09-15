import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import { getAllProjects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <div className={styles.homeContainer}>
      <section className={styles.identitySection} aria-label="Photographer Introduction">
        <p className={styles.introPrefix}>
          {siteConfig.profession} — {siteConfig.location}
        </p>
        <h1 className={styles.leadName}>{siteConfig.name}</h1>
        <p className={styles.statement}>{siteConfig.shortBio}</p>
        <Link href="/work" className={styles.viewWorkLink}>
          Explore Photographic Projects &rarr;
        </Link>
      </section>

      <section aria-label="Selected Projects">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Selected Photographic Inquiries</span>
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
