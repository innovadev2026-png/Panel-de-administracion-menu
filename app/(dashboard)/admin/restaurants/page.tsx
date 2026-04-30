"use client";

import { useEffect, useState } from "react";
import styles from "./restaurants.module.css";
import { adminDb } from "@/lib/firebaseAdmin";

type Restaurant = {
  id: string;
  name: string;
  status?: string;
  description?: string;
  phone?: string;
  address?: string;
  createdAt?: any;
};




export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [form, setForm] = useState<any>(null);

    const openModal = (r: any) => {
    setSelected(r);
    setForm(r);
    };

    const subcolecion = async ()=>{
        const res = await fetch("/api/restaurants/consult");
        const data = await res.json();

        // const subcollection = await getSubcollectionsOfCollection("restaurants");
        console.log(data);
    }

    subcolecion()
    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        await fetch("/api/restaurants/update", {
            method: "POST",
            body: JSON.stringify(form),
        });

        setSelected(null);
        fetchRestaurants();
    };

  const fetchRestaurants = async () => {
    const res = await fetch("/api/restaurants/list");
    const data = await res.json();
    console.log('data:', data);
    setRestaurants(data);
    setLoading(false);
  };

  const createRestaurant = async () => {
    if (!name.trim()) return;

    await fetch("/api/restaurants/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchRestaurants();
  };

  const toggleStatus = async (id: string, current: string) => {
    await fetch("/api/restaurants/toggle", {
      method: "POST",
      body: JSON.stringify({
        id,
        status: current === "active" ? "disabled" : "active",
      }),
    });

    fetchRestaurants();
    setSelected(null);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const formatDate = (timestamp: any) => {
    // console.log(timestamp._seconds);
    if (!timestamp?._seconds) return "—";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString();
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <h1>Restaurantes</h1>

      {/* CREAR */}
      <div className={styles.form}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del restaurante"
          className={styles.input}
        />
        <button onClick={createRestaurant} className={styles.button}>
          Crear
        </button>
      </div>

      {/* LISTA */}
      <div className={styles.list}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            className={styles.card}
            // onClick={() => setSelected(r)}
            onClick={() => openModal(r)}
          >
            <h3>{r.name}</h3>
            <span>{r.status}</span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && form && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Restaurante</h2>

            <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={styles.input}
                placeholder="Nombre"
            />

            <input
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className={styles.input}
                placeholder="Dirección"
            />

            <input
                value={form.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={styles.input}
                placeholder="Teléfono"
            />

            <textarea
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className={styles.textarea}
                placeholder="Descripción"
            />

            {/* COLORES */}
            <div className={styles.colors}>
                <input
                type="color"
                value={form.settings?.colors?.bg}
                onChange={(e) =>
                    setForm((prev: any) => ({
                    ...prev,
                    settings: {
                        ...prev.settings,
                        colors: {
                        ...prev.settings.colors,
                        bg: e.target.value,
                        },
                    },
                    }))
                }
                />
                <input
                type="color"
                value={form.settings?.colors?.accent}
                onChange={(e) =>
                    setForm((prev: any) => ({
                    ...prev,
                    settings: {
                        ...prev.settings,
                        colors: {
                        ...prev.settings.colors,
                        accent: e.target.value,
                        },
                    },
                    }))
                }
                />
            </div>

            <div className={styles.actions}>
                <button onClick={handleSave} className={styles.save}>
                Guardar
                </button>

                <button
                onClick={() =>
                    toggleStatus(form.id, form.status || "active")
                }
                className={styles.toggle}
                >
                {form.status === "active" ? "Deshabilitar" : "Activar"}
                </button>
            </div>
            </div>
        </div>
)}
    </div>
  );
}