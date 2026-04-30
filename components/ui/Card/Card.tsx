// /components/ui/Card/index.tsx
import styles from "./Card.module.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
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
}: Props) {
  const classes = [
    styles.card,
    hover ? styles.hover : "",
    styles[padding],
    onClick ? styles.clickable : "",
    className,
  ].join(" ");

  return (
    <div className={classes} onClick={onClick}>
      
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      )}

      <div className={styles.content}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}