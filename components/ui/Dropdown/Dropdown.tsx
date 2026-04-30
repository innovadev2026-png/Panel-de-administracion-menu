// /components/ui/Dropdown/index.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
import Button from "@/components/ui/Button/Button";

type DropdownItem = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

type Props = {
  label?: string;
  items: DropdownItem[];
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
};

export default function Dropdown({
  label = "Acciones",
  items,
  variant = "secondary",
  size = "sm",
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      
      {/* Trigger */}
      <div
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children ? (
          children
        ) : (
          <Button variant={variant} size={size}>
            {label}
          </Button>
        )}
      </div>

      {/* Menu */}
      {open && (
        <div className={styles.menu}>
          {items.map((item, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              fullWidth
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                setOpen(false);
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}