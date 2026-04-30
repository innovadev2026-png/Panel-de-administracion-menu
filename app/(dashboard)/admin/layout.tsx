"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <div>Cargando...</div>;

  return <>{children}</>;
}