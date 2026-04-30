// /components/ui/Grid/index.tsx
import styles from "./Grid.module.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  columns?: number;       // columnas fijas (opcional)
  minWidth?: number;      // ancho mínimo para auto-fit (opcional)
  gap?: "sm" | "md" | "lg";
  className?: string;
};

export default function Grid({
  children,
  columns,
  minWidth = 250,
  gap = "md",
  className = "",
}: Props) {
  const classes = [
    styles.grid,
    styles[gap],
    className,
  ].join(" ");

  const gridStyle = {
    gridTemplateColumns: columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
  };

  return (
    <div className={classes} style={gridStyle}>
      {children}
    </div>
  );
}