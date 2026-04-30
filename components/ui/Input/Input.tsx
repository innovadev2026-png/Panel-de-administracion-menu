// /components/ui/Input/index.tsx
import styles from "./Input.module.css";

type Props = {
  label?: string;
  error?: string; // ✅ opcional
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, ...props }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        {...props}
      />

      {error && <span className={styles.message}>{error}</span>}
    </div>
  );
}