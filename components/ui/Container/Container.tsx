// /components/ui/Container/index.tsx

import styles from "./Container.module.css";
import { ReactNode, CSSProperties } from "react";

type Props = {
  children: ReactNode;
  fluid?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  maxWidth?: number;
  center?: boolean; // ✅ agregado
  style?: CSSProperties;
};

export default function Container({
  children,
  fluid = false,
  padding = "md",
  className = "",
  maxWidth,
  center = false,
  style,
}: Props) {
  const classes = [
    styles.container,
    fluid ? styles.fluid : "",
    styles[padding],
    center ? styles.center : "", // ✅ agregado
    className,
  ].join(" ");

  const dynamicStyle = {
    ...(maxWidth && !fluid
      ? { maxWidth: `${maxWidth}px` }
      : {}),
    ...style,
  };

  return (
    <div className={classes} style={dynamicStyle}>
      {children}
    </div>
  );
}