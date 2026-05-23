import styles from "./Card.module.css";
import { ReactNode, CSSProperties } from "react";

type Props = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;

  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";

  className?: string;
  onClick?: () => void;

  /* NUEVO */
  backgroundImage?: string;
  overlay?: boolean;
};

export default function Card({
  children,
  title,
  description,
  footer,
  hover = true,
  padding = "md",
  className = "",
  onClick,

  backgroundImage,
  overlay = true,
}: Props) {

  const classes = [
    styles.card,
    hover ? styles.hover : "",
    styles[padding],
    onClick ? styles.clickable : "",
    backgroundImage ? styles.hasBg : "",
    className,
  ].join(" ");

  const style: CSSProperties = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
      }
    : {};

  return (
    <div
      className={classes}
      onClick={onClick}
      style={style}
    >

      {/* OVERLAY */}
      {backgroundImage && overlay && (
        <div className={styles.overlay} />
      )}

      {/* CONTENIDO */}
      <div className={styles.inner}>

        {(title || description) && (
          <div className={styles.header}>
            {title && (
              <h3 className={styles.title}>
                {title}
              </h3>
            )}

            {description && (
              <p className={styles.description}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={styles.content}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}