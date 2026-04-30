// /components/ui/Textarea/index.tsx
import styles from "./Textarea.module.css";

type Props = {
  label?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ label, error, ...props }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={`${styles.textarea} ${error ? styles.error : ""}`}
        {...props}
      />
      {error && <span className={styles.message}>{error}</span>}
    </div>
  );
}