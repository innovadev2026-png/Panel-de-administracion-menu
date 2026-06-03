"use client";

import Sidebar, {MenuGroup} from "./Sidebar/Sidebar";
import NavBar from "./NavBar/NavBar";
import { logout } from "@/lib/logout";
// import styles from "./layout.module.css";
const menu: MenuGroup[] = [
  {
    label: "General",
    items: [
      { name: "Dashboard", path: "/admin" },
    ],
  },
  {
    label: "Gestión",
    items: [
      { name: "Usuarios", path: "/admin/users" },
      { name: "Restaurantes", path: "/admin/restaurants" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { name: "Configuración", path: "/admin/settings" },
    ],
  },
];
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar menu={menu} nameEmpresa="hp"/>
      <NavBar onLogout={logout}/>
      <main>{children}</main>
    </>
  );
}
