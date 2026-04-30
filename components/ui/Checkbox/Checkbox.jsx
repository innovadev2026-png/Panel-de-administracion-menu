// /components/ui/Checkbox/index.tsx
import styles from "./Checkbox.module.css";

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box}></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}