import type { Metadata } from 'next';
import { getAllProjects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Photographic works and series by Dilkhush Choubey.',
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <div className={styles.workContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Work</h1>
        <span className="meta-stamp">Archive · {projects.length} Works</span>
      </header>

      <section className={styles.projectsList} aria-label="Photographic Works">
        {projects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} priority={idx === 0} />
        ))}
      </section>
    </div>
  );
}
