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

type RestaurantColors = {
  bg?: string;
  card?: string;
  text?: string;
  muted?: string;
  accent?: string;
  primary?: string;
  secondary?: string;
  border?: string;
};

type Restaurant = {
  name?: string;
  settings?: {
    colors?: RestaurantColors;
  };
};

type User = {
  name?: string;
  image?: string;
  role?: string;
  accesses?: string[];
  permissions?: string[];
};

const baseMenu: MenuGroup[] = [
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

function canAccess(user: User, access: string) {
  return (
    user.role === "SuperAdmin" ||
    user.accesses?.includes(access) ||
    user.accesses?.includes("*")
  );
}

function getMenu(user: User): MenuGroup[] {
  return baseMenu
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.path === "/admin") return canAccess(user, "dashboard");
        if (item.path === "/admin/users") return canAccess(user, "users");
        if (item.path === "/admin/restaurants") {
          return canAccess(user, "restaurants") || canAccess(user, "restaurant");
        }
        if (item.path === "/admin/settings") return canAccess(user, "settings");
        return false;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

const DEFAULT_THEME: Required<RestaurantColors> = {
  bg: "#080807",
  card: "#1a1a1a",
  text: "#ffffff",
  muted: "#aaaaaa",
  accent: "#00f510",
  primary: "#111111",
  secondary: "#222222",
  border: "#222222",
};

const THEME_VARIABLES: Array<[keyof RestaurantColors, string]> = [
  ["bg", "--bg"],
  ["card", "--card"],
  ["text", "--text"],
  ["muted", "--muted"],
  ["accent", "--accent"],
  ["primary", "--primary"],
  ["secondary", "--secondary"],
  ["border", "--border"],
];

function getTheme(colors?: RestaurantColors) {
  return {
    ...DEFAULT_THEME,
    ...colors,
    border: colors?.border || colors?.secondary || colors?.muted || DEFAULT_THEME.border,
  };
}

function applyTheme(colors?: RestaurantColors) {
  const theme = getTheme(colors);
  const root = document.documentElement;

  THEME_VARIABLES.forEach(([key, variable]) => {
    const value = theme[key];

    if (typeof value === "string" && value.trim()) {
      root.style.setProperty(variable, value);
    }
  });
}

export default function Layout({ children }: Props) {
  const [dataRestaurant, setDataRestaurant] = useState<Restaurant>({})
  const [dataUser, setDataUser] = useState<User>({})

  useEffect(() => {
    const data = async () => {
      try {
        const [restaurantRes, userRes] = await Promise.all([
          fetch("/api/restaurants/list"),
          fetch("/api/auth/user"),
        ]);

        if (!restaurantRes.ok || !userRes.ok) return;

        const restaurants = await restaurantRes.json();
        const user = await userRes.json();

        const userData = user.data ?? {};

        setDataRestaurant(restaurants[0] ?? {});
        setDataUser(userData);
        applyTheme(
          userData.role === "SuperAdmin"
            ? DEFAULT_THEME
            : restaurants[0]?.settings?.colors
        );
      } catch {
        return
      }
    }
    data()
  },[])

  useEffect(() => {
    applyTheme(
      dataUser.role === "SuperAdmin"
        ? DEFAULT_THEME
        : dataRestaurant.settings?.colors
    );
  }, [dataRestaurant, dataUser.role])

  useEffect(() => {
    const handleThemeUpdate = (event: Event) => {
      if (dataUser.role === "SuperAdmin") {
        applyTheme(DEFAULT_THEME);
        return;
      }

      const customEvent = event as CustomEvent<RestaurantColors>;
      applyTheme(customEvent.detail);
    };

    window.addEventListener("restaurant-theme-updated", handleThemeUpdate);

    return () => {
      window.removeEventListener("restaurant-theme-updated", handleThemeUpdate);
    };
  }, [dataUser.role])

  // console.log(dataUser)
  return (
    <div className={styles.layout}>
      
      {/* Sidebar */}
      <Sidebar
        menu={getMenu(dataUser)}
        nameEmpresa={dataRestaurant?.name}
        role={dataUser?.role}
      />

      {/* Main area */}
      <div className={styles.main}>
        
        {/* Top navbar */}
        <Navbar
          title="Panel de Control"
          user={{
            name: dataUser?.name || "nombre de usuario",
            avatar: dataUser?.image,
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
