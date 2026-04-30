"use client";

import styles from "./layout.module.css";
import { logout } from "@/lib/logout";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <span className={styles.title}>Panel de Control</span>

      <button className={styles.logout} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}