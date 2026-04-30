// /components/ui/Drawer/index.tsx
import styles from "./Drawer.module.css";

export default function Drawer({ isOpen, onClose, children }) {
  return (
    <div
      className={`${styles.overlay} ${
        isOpen ? styles.open : ""
      }`}
      onClick={onClose}
    >
      <div
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}