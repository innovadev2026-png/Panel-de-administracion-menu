// /components/ui/Button/index.tsx
"use client";
import styles from "./Button.module.css";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  className = "",
  onClick,
  type = "button",
}: Props) {
  const isDisabled = disabled || loading;

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    isDisabled ? styles.disabled : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
    >
      {/* Loader */}
      {loading && <span className={styles.loader} />}

      {/* Icon (solo si no está loading) */}
      {!loading && icon && (
        <span className={styles.icon}>{icon}</span>
      )}

      {/* Texto */}
      {children && (
        <span className={styles.label}>{children}</span>
      )}
    </button>
  );
}