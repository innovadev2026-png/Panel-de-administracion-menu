"use client";

import { useEffect, useState } from "react";
import styles from "./restaurants.module.css";
import { adminDb } from "@/lib/firebaseAdmin";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";
import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";
import Avatar from "@/components/ui/Avatar/Avatar";
import ColorInput from "@/components/ui/ColorInput/ColorInput";
import Grid from "@/components/ui/Grid/Grid";
import Modal from "@/components/ui/Modal/Modal";

type Restaurant = {
  id: string;
  name: string;
  isActive?: boolean;
  description?: string;
  phone?: string;
  address?: string;
  createdAt?: any;
  logo?: string;
  coverImage?: string;
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
        // console.log(data);
    }
    console.log("esto es form:", form);
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
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del restaurante"
        />
        {/*  */}
        <Button onClick={createRestaurant}>
          Crear
        </Button>
      </div>

      {/* LISTA */}
      <div className={styles.list}>
        <Grid minWidth={300}>
        {restaurants.map((r) => (
          <Card 
            key={r.id}
            title={r.name}
            description={`Creado: ${formatDate(r.createdAt)} - Estado: ${r.isActive ? "Activo" : "Inactivo"}`}
            backgroundImage={r.coverImage}
            onClick={() => openModal(r)}
            >
              {/* {console.log("restaurante:", r)} */}
            <Avatar name={r.name} src={r.logo} size={150}/>
          
            <h3>{r.address}</h3>
          </Card>
        ))}
        </Grid>
      </div>

      {/* MODAL */}
<Modal
  isOpen={!!selected && !!form}
  onClose={() => setSelected(null)}
  title="Editar Restaurante"
  size="lg"
>
  <Input
    label="Nombre"
    value={form?.name || ""}
    onChange={(e: any) =>
      handleChange("name", e.target.value)
    }
  />

  <Input
    label="Dirección"
    value={form?.address || ""}
    onChange={(e: any) =>
      handleChange("address", e.target.value)
    }
  />

  <Input
    label="Teléfono"
    value={form?.phone || ""}
    onChange={(e: any) =>
      handleChange("phone", e.target.value)
    }
    placeholder="Teléfono"
  />

  <Textarea
    label="Descripción"
    value={form?.description || ""}
    onChange={(e) =>
      handleChange("description", e.target.value)
    }
    placeholder="Descripción"
  />

  {/* COLORES */}
  <div className={styles.colors}>

    <Grid minWidth={250}>

      <ColorInput
        label="Color de fondo"
        value={form?.settings?.colors?.bg || "#000000"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                bg: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color primario"
        value={form?.settings?.colors?.primary || "#000000"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                primary: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color secundario"
        value={form?.settings?.colors?.secondary || "#000000"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                secondary: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color de texto"
        value={form?.settings?.colors?.text || "#ffffff"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                text: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color de resaltado"
        value={form?.settings?.colors?.accent || "#00c853"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                accent: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color de tarjetas"
        value={form?.settings?.colors?.card || "#1a1a1a"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                card: value,
              },
            },
          }))
        }
      />

      <ColorInput
        label="Color de pasivos"
        value={form?.settings?.colors?.muted || "#aaaaaa"}
        onChange={(value) =>
          setForm((prev: any) => ({
            ...prev,
            settings: {
              ...prev.settings,
              colors: {
                ...prev.settings.colors,
                muted: value,
              },
            },
          }))
        }
      />

    </Grid>

  </div>

  {/* ACTIONS */}
  <div className={styles.actions}>

    <Button onClick={handleSave}>
      Guardar
    </Button>

    <Button
      onClick={() => setSelected(null)}
      variant="secondary"
    >
      Cancelar
    </Button>

    <Button
      onClick={() =>
        toggleStatus(
          form.id,
          form.isActive || "active"
        )
      }
    >
      {form?.isActive
        ? "Deshabilitar"
        : "Activar"}
    </Button>

  </div>

</Modal>

    </div>
  );
}