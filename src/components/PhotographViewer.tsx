import Image from 'next/image';
import { Photograph } from '@/types/photography';
import styles from './PhotographViewer.module.css';

interface PhotographViewerProps {
  photo: Photograph;
  priority?: boolean;
}

export default function PhotographViewer({ photo, priority = false }: PhotographViewerProps) {
  const meta = photo.metadata;
  const hasMeta = meta && (meta.location || meta.date || meta.time || meta.notes);

  return (
    <figure className={styles.container}>
      <div
        className={styles.frame}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority}
          className={styles.image}
          sizes="(max-width: 900px) 100vw, 1360px"
        />
      </div>

      {(photo.title || hasMeta) && (
        <figcaption className={styles.captionBar}>
          {photo.title ? <span className={styles.photoTitle}>{photo.title}</span> : <span />}

          {hasMeta && (
            <div className={styles.metadata}>
              {meta.location && <span className={styles.metaItem}>{meta.location}</span>}
              {meta.location && (meta.date || meta.time) && (
                <span className={styles.separator}>·</span>
              )}
              {meta.date && <span className={styles.metaItem}>{meta.date}</span>}
              {meta.date && meta.time && <span className={styles.separator}>·</span>}
              {meta.time && <span className={styles.metaItem}>{meta.time}</span>}
              {meta.notes && (
                <>
                  {(meta.location || meta.date || meta.time) && (
                    <span className={styles.separator}>·</span>
                  )}
                  <span className={styles.metaItem}>{meta.notes}</span>
                </>
              )}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
