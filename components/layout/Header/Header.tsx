// /components/layout/Navbar/index.tsx
"use client";

import styles from "./Header.module.css";
import Button from "@/components/ui/Button/Button";
import Avatar from "@/components/ui/Avatar/Avatar";
import Dropdown from "@/components/ui/Dropdown/Dropdown";

type User = {
  name: string;
  avatar?: string;
};

type Props = {
  title?: string;
  user?: User;
  onLogout: () => void;
};

export default function Navbar({
  title = "Panel de Control",
  user,
  onLogout,
}: Props) {
  return (
    <header className={styles.navbar}>
      
      {/* Left */}
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* Right */}
      <div className={styles.right}>
        
        {/* Usuario */}
        {user && (
          <Dropdown
            label=""
            items={[
              {
                label: "Cerrar sesión",
                onClick: onLogout,
              },
            ]}
          >
            <div className={styles.user}>
              <Avatar
                // src={user.avatar||""}
                name={user.name||"Usuario"}
                size={32}
              />
              <span className={styles.name}>
                {user.name}
              </span>
            </div>
          </Dropdown>
        )}

        {/* Fallback sin usuario */}
        {!user && (
          <Button size="sm" variant="outline" onClick={onLogout}>
            Cerrar sesión
          </Button>
        )}
      </div>
    </header>
  );
}