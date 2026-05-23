"use client";

import { ReactNode } from "react";
import styles from "./Modal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;

  size?: "sm" | "md" | "lg" | "xl";
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >

      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className={styles.header}>

          {title && (
            <h2 className={styles.title}>
              {title}
            </h2>
          )}

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {children}
        </div>

      </div>
    </div>
  );
}