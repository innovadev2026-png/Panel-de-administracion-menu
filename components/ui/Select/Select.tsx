// /components/ui/Select/index.tsx
import styles from "./Select.module.css";

type Props = {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ label, options = [], error, ...props }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={`${styles.select} ${error ? styles.error : ""}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.message}>{error}</span>}
    </div>
  );
}