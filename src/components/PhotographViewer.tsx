import Image from 'next/image';
import { Photograph } from '@/types/photography';
import styles from './PhotographViewer.module.css';

interface PhotographViewerProps {
  photo: Photograph;
  priority?: boolean;
}

export default function PhotographViewer({ photo, priority = false }: PhotographViewerProps) {
  const getRatioClass = (ratio: string) => {
    switch (ratio) {
      case '4:3':
        return styles.ratio4x3;
      case '16:9':
        return styles.ratio16x9;
      case '1:1':
        return styles.ratio1x1;
      case '3:2':
      default:
        return styles.ratio3x2;
    }
  };

  const meta = photo.metadata;
  const hasMeta = meta && (meta.location || meta.date || meta.time);

  return (
    <figure className={styles.container}>
      <div className={`${styles.frame} ${getRatioClass(photo.aspectRatio)}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority}
          className={styles.image}
          sizes="(max-width: 900px) 100vw, 1200px"
        />
      </div>

      <figcaption className={styles.captionBar}>
        {photo.title && <span className={styles.photoTitle}>{photo.title}</span>}

        {hasMeta && (
          <div className={styles.metadata}>
            {meta.location && <span className={styles.metaItem}>{meta.location}</span>}
            {meta.location && (meta.date || meta.time) && (
              <span className={styles.separator}>·</span>
            )}
            {meta.date && <span className={styles.metaItem}>{meta.date}</span>}
            {meta.date && meta.time && <span className={styles.separator}>·</span>}
            {meta.time && <span className={styles.metaItem}>{meta.time}</span>}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
