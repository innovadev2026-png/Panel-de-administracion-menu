// /components/ui/EmptyState/index.tsx
import styles from "./EmptyState.module.css";
import { ReactNode } from "react";

type Props = {
  title?: string;
  description?: string;
  action?: ReactNode; // ✅ opcional
};

export default function EmptyState({
  title = "Sin datos",
  description = "",
  action,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>📭</div>

      <h3 className={styles.title}>{title}</h3>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}
    </div>
  );
}