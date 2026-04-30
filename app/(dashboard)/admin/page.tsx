"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";

type Stats = {
  totalUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  disabledRestaurants: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/global");
        const data = await res.json();

        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className={styles.loader}>Cargando métricas...</div>;

  if (!stats) return <div>Error cargando datos</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span>Total Usuarios</span>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className={styles.card}>
          <span>Total Restaurantes</span>
          <h2>{stats.totalRestaurants}</h2>
        </div>

        <div className={styles.card}>
          <span>Restaurantes Activos</span>
          <h2>{stats.activeRestaurants}</h2>
        </div>

        <div className={styles.card}>
          <span>Restaurantes Deshabilitados</span>
          <h2>{stats.disabledRestaurants}</h2>
        </div>
      </div>
    </div>
  );
}