"use client";

import styles from "./Switch.module.css";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;

  label?: string;
  disabled?: boolean;
};

export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: Props) {
  return (
    <div
      className={`${styles.wrapper} ${
        disabled ? styles.disabled : ""
      }`}
    >

      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <button
        type="button"
        className={`${styles.switch} ${
          checked ? styles.active : ""
        }`}
        onClick={() =>
          !disabled && onChange(!checked)
        }
        disabled={disabled}
      >
        <span className={styles.thumb} />
      </button>

    </div>
  );
}