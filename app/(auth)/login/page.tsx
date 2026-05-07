// /app/login/page.tsx
import LoginPage from "@/components/login/loginpage";
import styles from "./login.module.css";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      
      {/* Fondo */}
      <div className={styles.background} />

      {/* Glow decorativo */}
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      {/* Contenido */}
      <div className={styles.content}>
        <LoginPage />
      </div>
    </div>
  );
}