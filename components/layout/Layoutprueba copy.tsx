// /components/layout/Layout/index.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./Layout.module.css";
import Sidebar, { MenuGroup } from "@/components/layout/Sidebar/Sidebar";
import Navbar from "@/components/layout/NavBar/NavBar";
import { logout } from "@/lib/logout";
import { Home, Users, Store, Settings } from "lucide-react";


type Props = {
  children: ReactNode;
};

const menu: MenuGroup[] = [
  {
    label: "General",
    items: [
      { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
    ],
  },
  {
    label: "Gestión",
    items: [
      { name: "Usuarios", path: "/admin/users", icon: <Users size={18} /> },
      { name: "Restaurantes", path: "/admin/restaurants", icon: <Store size={18} /> },
    ],
  },
  {
    label: "Sistema",
    items: [
      { name: "Configuración", path: "/admin/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function Layout({ children }: Props) {
  const [dataRestaurant, setDataRestaurant] = useState({})
  const [dataUser, setDataUser] = useState({})

  useEffect(() => {
    const data = async () => {
      try {
        const res = await fetch("/api/restaurants/consult")
        const data = await res.json()
        const firstKey = Object.keys(data)[0];
        setDataRestaurant(data[firstKey])
        const userRes = await fetch("/api/auth/user")
        const datauser = await userRes.json()
        setDataUser(datauser.data)

        // console.log("esto es datauser", datauser)
      } catch {
        return
      }
    }
    data()
  },[])

  // console.log(dataUser)
  return (
    <div className={styles.layout}>
      
      {/* Sidebar */}
      <Sidebar menu={menu} nameEmpresa={dataRestaurant?.name} role={dataUser?.role}/>

      {/* Main area */}
      <div className={styles.main}>
        
        {/* Top navbar */}
        <Navbar
          title="Panel de Control"
          user={{
            name: dataUser.name,
            avatar: dataUser.image,
          }}
          onLogout={logout}
        />

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}