"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styles from "./restaurants.module.css";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";
import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";
import Avatar from "@/components/ui/Avatar/Avatar";
import ColorInput from "@/components/ui/ColorInput/ColorInput";
import Grid from "@/components/ui/Grid/Grid";
import Modal from "@/components/ui/Modal/Modal";

type FirestoreTimestamp = {
  _seconds?: number;
};

type RestaurantColors = {
  bg?: string;
  primary?: string;
  secondary?: string;
  text?: string;
  accent?: string;
  card?: string;
  muted?: string;
};

type Restaurant = {
  id?: string;
  name: string;
  status?: "active" | "disabled";
  description?: string;
  phone?: string;
  address?: string;
  createdAt?: FirestoreTimestamp;
  logo?: string;
  logoFile?: File | null;
  coverImage?: string;
  coverImageFile?: File | null;
  settings?: {
    colors?: RestaurantColors;
  };
};

const DEFAULT_COLORS: Required<RestaurantColors> = {
  bg: "#000000",
  primary: "#000000",
  secondary: "#000000",
  text: "#ffffff",
  accent: "#00c853",
  card: "#1a1a1a",
  muted: "#aaaaaa",
};

const EMPTY_RESTAURANT: Restaurant = {
  name: "",
  status: "active",
  description: "",
  phone: "",
  address: "",
  logo: "",
  logoFile: null,
  coverImage: "",
  coverImageFile: null,
  settings: {
    colors: DEFAULT_COLORS,
  },
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Restaurant | null>(null);

  const openModal = (restaurant: Restaurant) => {
    setSelected(restaurant);
    setForm({
      ...restaurant,
      logoFile: null,
      coverImageFile: null,
    });
  };

  const openCreateModal = () => {
    setSelected(null);
    setForm({ ...EMPTY_RESTAURANT });
  };

  const closeModal = () => {
    setSelected(null);
    setForm(null);
  };

  const handleChange = (field: keyof Restaurant, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleColorChange = (field: keyof RestaurantColors, value: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        settings: {
          ...prev.settings,
          colors: {
            ...prev.settings?.colors,
            [field]: value,
          },
        },
      };
    });
  };

  const handleImageChange = (
    field: "logo" | "coverImage",
    fileField: "logoFile" | "coverImageFile",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: URL.createObjectURL(file),
            [fileField]: file,
          }
        : prev
    );
  };

  const fetchRestaurants = async () => {
    const res = await fetch("/api/restaurants/list");
    const data = await res.json();
    setRestaurants(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form) return;

    const endpoint = selected
      ? "/api/restaurants/update"
      : "/api/restaurants/create";
    const formData = new FormData();

    if (selected?.id) {
      formData.append("id", selected.id);
    }

    formData.append("name", form.name || "");
    formData.append("description", form.description || "");
    formData.append("address", form.address || "");
    formData.append("phone", form.phone || "");
    formData.append("logo", form.logo || "");
    formData.append("coverImage", form.coverImage || "");
    formData.append("settings", JSON.stringify(form.settings || {}));

    if (form.logoFile) {
      formData.append("logoFile", form.logoFile);
    }

    if (form.coverImageFile) {
      formData.append("coverImageFile", form.coverImageFile);
    }

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Error guardando restaurante");
      return;
    }

    closeModal();
    fetchRestaurants();
  };

  const toggleStatus = async (id: string, current: Restaurant["status"]) => {
    await fetch("/api/restaurants/toggle", {
      method: "POST",
      body: JSON.stringify({
        id,
        status: current === "active" ? "disabled" : "active",
      }),
    });

    fetchRestaurants();
    closeModal();
  };

  useEffect(() => {
    const init = async () => {
      await fetchRestaurants();
    };

    init();
  }, []);

  const formatDate = (timestamp?: FirestoreTimestamp) => {
    if (!timestamp?._seconds) return "-";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString();
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <h1>Restaurantes</h1>

      <div className={styles.form}>
        <Button onClick={openCreateModal}>
          Crear
        </Button>
      </div>

      <div className={styles.list}>
        <Grid minWidth={300}>
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              title={restaurant.name}
              description={`Creado: ${formatDate(
                restaurant.createdAt
              )} - Estado: ${
                restaurant.status === "active" ? "Activo" : "Inactivo"
              }`}
              backgroundImage={restaurant.coverImage}
              onClick={() => openModal(restaurant)}
            >
              <Avatar
                name={restaurant.name}
                src={restaurant.logo}
                size={150}
              />

              <h3>{restaurant.address}</h3>
            </Card>
          ))}
        </Grid>
      </div>

      <Modal
        isOpen={!!form}
        onClose={closeModal}
        title={selected ? "Editar Restaurante" : "Crear Restaurante"}
        size="lg"
      >
        <Input
          label="Nombre"
          value={form?.name || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("name", e.target.value)
          }
        />

        <Input
          label="Direccion"
          value={form?.address || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("address", e.target.value)
          }
        />

        <Input
          label="Telefono"
          value={form?.phone || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("phone", e.target.value)
          }
          placeholder="Telefono"
        />

        <Textarea
          label="Descripcion"
          value={form?.description || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", e.target.value)
          }
          placeholder="Descripcion"
        />

        <Input
          label="Logo"
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleImageChange("logo", "logoFile", e)
          }
        />

        {form?.logo && (
          <Avatar
            name={form.name}
            src={form.logo}
            size={96}
          />
        )}

        <Input
          label="Imagen de portada"
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleImageChange("coverImage", "coverImageFile", e)
          }
        />

        {form?.coverImage && (
          <Card backgroundImage={form.coverImage} padding="lg">
            <span>{form.name || "Vista previa"}</span>
          </Card>
        )}

        <div className={styles.colors}>
          <Grid minWidth={250}>
            {Object.entries(DEFAULT_COLORS).map(([key, fallback]) => (
              <ColorInput
                key={key}
                label={`Color ${key}`}
                value={
                  form?.settings?.colors?.[key as keyof RestaurantColors] ||
                  fallback
                }
                onChange={(value) =>
                  handleColorChange(key as keyof RestaurantColors, value)
                }
              />
            ))}
          </Grid>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleSave}>
            Guardar
          </Button>

          <Button
            onClick={closeModal}
            variant="secondary"
          >
            Cancelar
          </Button>

          {selected?.id && (
            <Button
              onClick={() => toggleStatus(selected.id as string, form?.status)}
            >
              {form?.status === "active" ? "Deshabilitar" : "Activar"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
