// /components/ui/Container/index.tsx
import styles from "./Container.module.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  fluid?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  maxWidth?: number; // opcional override
};

export default function Container({
  children,
  fluid = false,
  padding = "md",
  className = "",
  maxWidth,
}: Props) {
  const classes = [
    styles.container,
    fluid ? styles.fluid : "",
    styles[padding],
    className,
  ].join(" ");

  const style = !fluid && maxWidth
    ? { maxWidth: `${maxWidth}px` }
    : undefined;

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}