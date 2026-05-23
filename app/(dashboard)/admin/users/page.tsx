"use client";

import { useEffect, useState } from "react";

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

import styles from "./users.module.css";

/* TYPES */
type Role = {
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

  createdAt?: any;

  image?: string;
  imageFile?: File | null;

  role?: string;
};

const INITIAL_FORM: User = {
  name: "",
  email: "",
  password: "",
  role: "user",
  isActive: true,
  image: "",
  imageFile: null,
};

export default function UsersPage() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [selected, setSelected] =
    useState<User | null>(null);

  const [form, setForm] =
    useState<User>(INITIAL_FORM);

  /* STATES */
const [saving, setSaving] =
  useState(false);

const [deleting, setDeleting] =
  useState(false);

  /* =====================================
     USERS
  ===================================== */

  const fetchUsers = async () => {
    try {

      const res = await fetch(
        "/api/users/consult"
      );

      const data = await res.json();

      if (!data || typeof data !== "object") {
        setUsers([]);
        return;
      }

      const usersArray: User[] =
        Object.entries(data).map(
          ([id, user]: any) => ({
            id,
            ...user,
          })
        );

      setUsers(usersArray);

    } catch (error) {

      console.error(error);

      setUsers([]);
    }
  };

  /* =====================================
     ROLES
  ===================================== */

  const fetchRoles = async () => {
    try {

      const res = await fetch(
        "/api/roles/consult"
      );

      const data = await res.json();

      if (!data || typeof data !== "object") {
        setRoles([]);
        return;
      }

      const rolesArray: Role[] =
        Object.entries(data).map(
          ([id, role]: any) => ({
            id,
            ...role,
          })
        );

      setRoles(rolesArray);

    } catch (error) {

      console.error(error);

      setRoles([]);
    }
  };

  /* =====================================
     INIT
  ===================================== */

  useEffect(() => {

    const init = async () => {

      try {

        setLoading(true);

        await Promise.all([
          fetchUsers(),
          fetchRoles(),
        ]);

      } finally {

        setLoading(false);
      }
    };

    init();

  }, []);

  /* =====================================
     MODAL
  ===================================== */

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

  /* =====================================
     CHANGE
  ===================================== */

  const handleChange = (
    field: keyof User,
    value: any
  ) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================
     IMAGE
  ===================================== */

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const preview =
      URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: preview,
      imageFile: file,
    }));
  };

  /* =====================================
     SAVE
  ===================================== */

  const handleSave = async () => {

  try {

    setSaving(true);

    const formData = new FormData();

    formData.append(
      "name",
      form.name || ""
    );

    formData.append(
      "email",
      form.email || ""
    );

    if (!selected) {

      formData.append(
        "password",
        form.password || ""
      );
    }

    formData.append(
      "role",
      form.role || ""
    );

    formData.append(
      "isActive",
      String(form.isActive)
    );

    if (selected?.id) {

      formData.append(
        "id",
        selected.id
      );

      formData.append(
        "currentImage",
        form.image || ""
      );
    }

    if (form.imageFile) {

      formData.append(
        "image",
        form.imageFile
      );
    }

    const endpoint = selected
      ? "/api/users/update"
      : "/api/users/create";

    const method = selected
      ? "PUT"
      : "POST";

    const res = await fetch(endpoint, {
      method,
      body: formData,
    });

    const data = await res.json();

    if (!data.ok) {

      throw new Error(
        data.error ||
        "Error guardando usuario"
      );
    }

    await fetchUsers();

    closeModal();

  } catch (error: any) {

    console.error(error);

    alert(error.message);

  } finally {

    setSaving(false);
  }
};
  /* =====================================
     ELIMINAR USUARIO
  ===================================== */
const handleDelete = async (
  id: string
) => {

  try {

    const confirmDelete =
      await Alert.confirm({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      });

    if (!confirmDelete) return;

    setDeleting(true);

    const res = await fetch(
      "/api/users/delete",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      }
    );

    const data = await res.json();

    if (!data.ok) {

      throw new Error(
        data.error ||
        "Error eliminando usuario"
      );
    }

    await fetchUsers();

    closeModal();

  } catch (error: any) {

    console.error(error);

    alert(error.message);

  } finally {

    setDeleting(false);
  }
};


  /* =====================================
     LOADING
  ===================================== */


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
          <p>
            Gestión de usuarios
          </p>
        </div>

        <Button onClick={openCreateModal}>
          Agregar Usuario
        </Button>

      </div>

      {/* GRID */}
      {users.length === 0 ? (

        <div className={styles.empty}>
          <p>No hay usuarios registrados</p>
        </div>

      ) : (

        <Grid minWidth={260} gap="md">

          {users.map((u) => (

            <Card
              key={u.id}
              hover
              className={styles.card}
              onClick={() =>
                openEditModal(u)
              }
            >

              <div className={styles.top}>

                <Avatar
                  src={u.image}
                  name={u.name}
                  size={72}
                />

                <div className={styles.userInfo}>

                  <h3>{u.name}</h3>

                  <p>{u.email}</p>

                  <span className={styles.role}>
                    {u.role}
                  </span>

                </div>

              </div>

              <div className={styles.statusContainer}>

                <span
                  className={
                    u.isActive
                      ? styles.active
                      : styles.inactive
                  }
                >
                  {u.isActive
                    ? "Activo"
                    : "Inactivo"}
                </span>

              </div>

            </Card>
          ))}

        </Grid>
      )}

      {/* MODAL */}
      <Modal
        isOpen={open}
        onClose={closeModal}
        title={
          selected
            ? "Editar Usuario"
            : "Crear Usuario"
        }
      >

        <div className={styles.form}>

          {/* IMAGE */}
          <div className={styles.imageSection}>

            <Avatar
              src={form.image}
              name={form.name}
              size={100}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className={styles.fileInput}
            />

          </div>

          {/* NAME */}
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e: any) =>
              handleChange(
                "name",
                e.target.value
              )
            }
          />

          {/* EMAIL */}
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e: any) =>
              handleChange(
                "email",
                e.target.value
              )
            }
          />

          {/* PASSWORD */}
          {!selected && (
            <Input
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e: any) =>
                handleChange(
                  "password",
                  e.target.value
                )
              }
            />
          )}

          {/* ROLE */}
          <Select
            label="Rol"
            value={form.role}
            onChange={(e: any) =>
              handleChange(
                "role",
                e.target.value
              )
            }
            options={roles.map((role) => ({
              label: role.name,
              value: role.name,
            }))}
          />

          {/* STATUS */}
          <Select
            label="Estado"
            value={
              form.isActive
                ? "true"
                : "false"
            }
            onChange={(e: any) =>
              handleChange(
                "isActive",
                e.target.value === "true"
              )
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

          {/* ACTIONS */}
          <div className={styles.actions}>

            <Button 
              disabled={saving}   
              onClick={handleSave}
            >
              {saving ? (
                <Spinner size={18} />
              ) : (
                "Guardar"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            {selected?.id && (

              <Button
                variant="danger"
                disabled={deleting}
                onClick={() =>
                  handleDelete(selected.id!)
                }
              >
                {deleting ? (
                  <Spinner size={18} />
                ) : (
                  "Eliminar"
                )}
              </Button>

            )}
            
          </div>

        </div>

      </Modal>

    </Container>
  );
}