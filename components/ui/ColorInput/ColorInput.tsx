"use client";

import styles from "./ColorInput.module.css";

type Props = {
  label?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function ColorInput({
  label,
  value,
  error,
  onChange,
}: Props) {
  return (
    <div className={styles.wrapper}>

      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputGroup}>

        {/* PICKER */}
        <input
          type="color"
          value={value}
          className={styles.color}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* HEX */}
        <input
          type="text"
          value={value}
          className={`${styles.text} ${
            error ? styles.error : ""
          }`}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />

      </div>

      {error && (
        <span className={styles.message}>
          {error}
        </span>
      )}

    </div>
  );
}