import type { Metadata } from 'next';
import { getAllProjects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Photographic projects and series by Dilkhush Choubey.',
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <div className={styles.workContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Work</h1>
        <span className="meta-stamp">Index of Photographic Projects &amp; Series</span>
      </header>

      <section className={styles.projectsContainer} aria-label="Photographic Projects">
        {projects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} priority={idx === 0} />
        ))}
      </section>
    </div>
  );
}
