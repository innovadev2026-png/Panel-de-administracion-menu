// /components/ui/Tabs/index.tsx
"use client";
import { useState } from "react";
import styles from "./Tabs.module.css";

type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  defaultValue?: string;
};

export default function Tabs({ tabs, defaultValue }: Props) {
  const initial = defaultValue || tabs[0]?.value;
  const [active, setActive] = useState(initial);

  const current = tabs.find((t) => t.value === active);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${
              active === tab.value ? styles.active : ""
            }`}
            onClick={() => setActive(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {current?.content}
      </div>
    </div>
  );
}