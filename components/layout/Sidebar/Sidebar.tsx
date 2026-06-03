// /components/layout/Sidebar/index.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import Button from "@/components/ui/Button/Button";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { Alert } from "@/components/ui/Alert/Alert";
import Grid from "@/components/ui/Grid/Grid";


export type MenuItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
  // role?: string[]; // Opcional: para control de acceso basado en roles
};

export type MenuGroup = {
  label?: string;
  items: MenuItem[];
};

type Props = {
  menu: MenuGroup[];
  title?: string;
  role?: string; // Para mostrar en el header y/o controlar acceso
  nameEmpresa?: string;
  onLogout?: () => void; // Función de logout opcional
};

export default function Sidebar({
  menu,
  role = "SuperAdmin",
  nameEmpresa = "nombre de empresa",

  onLogout,
}: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };
  // console.log("esto es nameEmpresa", nameEmpresa)

  // 🔹 fallback icon (primera letra)
  const getFallbackIcon = (name: string) => 
    name.charAt(0).toUpperCase();

  return (
    <aside
      className={`${styles.sidebar} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.logo}>
          {collapsed ? nameEmpresa.slice(0, 2) : nameEmpresa}
        </span>

        <button
          className={styles.toggle}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menu.map((group, i) => (
          <div key={i} className={styles.group}>
            
            {!collapsed && group.label && (
              <span className={styles.groupLabel}>
                {group.label}
              </span>
            )}

            {group.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.link} ${
                  isActive(item.path) ? styles.active : ""
                }`}
              >
                {/* ICONO (siempre visible en collapsed) */}
                <span className={styles.icon}>
                  {item.icon ?? getFallbackIcon(item.name)}
                </span>

                {/* TEXTO */}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <Grid columns={2}>
        {!collapsed && <span>{role}</span>}
        {!collapsed && 
                <Button 
                    variant="danger" size="sm"  
                    onClick={async () => {
                    const ok = await Alert.confirm({
                      title: "Cerrar sesión",
                      text: "¿Estás seguro de que quieres cerrar sesión?",
                    });
                    if (ok) onLogout?.();
                  }}
                >
                  Cerrar sesión
                </Button>}
        {collapsed && 
            <Tooltip text="Cerrar sesión">
              <Button
                  variant="danger"
                  onClick={async () => {
                    const ok = await Alert.confirm({
                      title: "Cerrar sesión",
                      text: "¿Estás seguro de que quieres cerrar sesión?",
                    });
                    if (ok) onLogout?.();
                  }}
                >
                 ⎋
              </Button>
            </Tooltip>
        }
        </Grid>
        {/* <Tooltip text="Cerrar sesión">
          <Button variant="outline" size="sm" onClick={() => alert("Logout")}>
            {collapsed ? "⎋" : "Cerrar sesión"}
          </Button>
        </Tooltip> */}
      </div>
    </aside>
  );
}
