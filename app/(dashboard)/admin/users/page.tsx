"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Container from "@/components/ui/Container/Container";
import Grid from "@/components/ui/Grid/Grid";
import Card from "@/components/ui/Card/Card";
import Avatar from "@/components/ui/Avatar/Avatar";
import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import { Alert } from "@/components/ui/Alert/Alert";
import Spinner from "@/components/ui/Spinner/Spinner";
import { auth } from "@/lib/firebaseClient";
import styles from "./users.module.css";

type FirestoreTimestamp = {
  _seconds?: number;
};

type Role = {
  id: string;
  name: string;
};

type Restaurant = {
  id: string;
  name: string;
};

type User = {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  password?: string;
  isActive?: boolean;
  createdAt?: FirestoreTimestamp;
  image?: string;
  imageFile?: File | null;
  role?: string;
  restaurantId?: string;
  restaurantName?: string;
  permissions?: string[];
  accesses?: string[];
};

type CollectionResponse<T> = Record<string, Omit<T, "id">>;

const INITIAL_FORM: User = {
  name: "",
  email: "",
  password: "",
  role: "Admin",
  restaurantId: "",
  isActive: true,
  image: "",
  imageFile: null,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function toCollectionArray<T extends { id?: string }>(
  data: unknown
): Array<T & { id: string }> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return [];
  }

  return Object.entries(data as CollectionResponse<T>).map(([id, value]) => ({
    id,
    ...value,
  })) as Array<T & { id: string }>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState<User>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/consult", {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setUsers(toCollectionArray<User>(data));
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles/consult", {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setRoles(toCollectionArray<Role>(data));
    } catch (error) {
      console.error(error);
      setRoles([]);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants/list", {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setRestaurants([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUsers(), fetchRoles(), fetchRestaurants()]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const openCreateModal = () => {
    setSelected(null);
    setForm(INITIAL_FORM);
    setOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelected(user);
    setForm({
      ...user,
      password: "",
      imageFile: null,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setForm(INITIAL_FORM);
  };

  const handleChange = <K extends keyof User>(field: K, value: User[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name || "");
      formData.append("email", form.email || "");

      if (!selected) {
        formData.append("password", form.password || "");
      }

      formData.append("role", form.role || "");
      formData.append("restaurantId", form.restaurantId || "");
      formData.append("isActive", String(form.isActive));

      if (selected?.id) {
        formData.append("id", selected.id);
        formData.append("currentImage", form.image || "");
      }

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      const endpoint = selected ? "/api/users/update" : "/api/users/create";
      const method = selected ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: await getAuthHeaders(),
        body: formData,
      });
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Error guardando usuario");
      }

      await fetchUsers();
      closeModal();
    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error, "Error guardando usuario"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = await Alert.confirm({
        title: "Confirmar eliminacion",
        text: "Estas seguro de que deseas eliminar este usuario? Esta accion no se puede deshacer.",
      });

      if (!confirmDelete) return;

      setDeleting(true);

      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          ...(await getAuthHeaders()),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Error eliminando usuario");
      }

      await fetchUsers();
      closeModal();
    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error, "Error eliminando usuario"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <h1>Usuarios</h1>
        <p>Cargando...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.header}>
        <div>
          <h1>Usuarios</h1>
          <p>Gestion de usuarios</p>
        </div>

        <Button onClick={openCreateModal}>
          Agregar Usuario
        </Button>
      </div>

      {users.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <Grid minWidth={260} gap="md">
          {users.map((user) => (
            <Card
              key={user.id}
              hover
              className={styles.card}
              onClick={() => openEditModal(user)}
            >
              <div className={styles.top}>
                <Avatar src={user.image} name={user.name} size={72} />

                <div className={styles.userInfo}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className={styles.role}>{user.role}</span>
                  {user.restaurantName && <p>{user.restaurantName}</p>}
                </div>
              </div>

              <div className={styles.statusContainer}>
                <span
                  className={user.isActive ? styles.active : styles.inactive}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      <Modal
        isOpen={open}
        onClose={closeModal}
        title={selected ? "Editar Usuario" : "Crear Usuario"}
      >
        <div className={styles.form}>
          <div className={styles.imageSection}>
            <Avatar src={form.image} name={form.name} size={100} />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className={styles.fileInput}
            />
          </div>

          <Input
            label="Nombre"
            value={form.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("name", e.target.value)
            }
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("email", e.target.value)
            }
          />

          {!selected && (
            <Input
              label="Contrasena"
              type="password"
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("password", e.target.value)
              }
            />
          )}

          <Select
            label="Rol"
            value={form.role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChange("role", e.target.value)
            }
            options={roles.map((role) => ({
              label: role.name,
              value: role.name,
            }))}
          />

          <Select
            label="Restaurante"
            value={form.restaurantId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChange("restaurantId", e.target.value)
            }
            options={[
              {
                label: "Selecciona un restaurante",
                value: "",
              },
              ...restaurants.map((restaurant) => ({
                label: restaurant.name,
                value: restaurant.id,
              })),
            ]}
          />

          <Select
            label="Estado"
            value={form.isActive ? "true" : "false"}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChange("isActive", e.target.value === "true")
            }
            options={[
              {
                label: "Activo",
                value: "true",
              },
              {
                label: "Inactivo",
                value: "false",
              },
            ]}
          />

          <div className={styles.actions}>
            <Button disabled={saving} onClick={handleSave}>
              {saving ? <Spinner size={18} /> : "Guardar"}
            </Button>

            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>

            {selected?.id && (
              <Button
                variant="danger"
                disabled={deleting}
                onClick={() => selected.id && handleDelete(selected.id)}
              >
                {deleting ? <Spinner size={18} /> : "Eliminar"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </Container>
  );
}
