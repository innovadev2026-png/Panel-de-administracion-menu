// /components/ui/Avatar/index.tsx
import styles from "./Avatar.module.css";

type Props = {
  src?: string;   // ✅ opcional
  name?: string;  // opcional pero recomendable
  size?: number;
};

export default function Avatar({ src, name, size = 32 }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className={styles.avatar}
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={styles.fallback}
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
}