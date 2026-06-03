"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/LayoutDashboard";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [dataRestaurant, setDataRestaurant] = useState({})

  useEffect(() => {
    
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify");

        if (!res.ok) {
          router.push("/login");
          return;
        }

        setLoading(false);
      } catch {
        router.push("/login");
      }
    };

    verify();
  }, [router]);

  if (loading) return <div>Cargando...</div>;

  return <Layout>{children}</Layout>;
}
