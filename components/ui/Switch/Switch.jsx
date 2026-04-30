// /components/ui/Switch/index.tsx
import styles from "./Switch.module.css";

export default function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`${styles.switch} ${checked ? styles.active : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  );
}