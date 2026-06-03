"use client";

import type { FirebaseError } from "firebase/app";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import Card from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert/Alert";
import Container from "@/components/ui/Container/Container";

const db = getFirestore();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos");
      Alert.error("Error", "Completa todos los campos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Usuario no registrado");
      }

      const data = userSnap.data();

      if (data.role !== "SuperAdmin") {
        throw new Error("No autorizado");
      }

      const token = await result.user.getIdToken();
      const secure = window.location.protocol === "https:" ? "; secure" : "";

      document.cookie = `token=${token}; path=/; max-age=3600; samesite=strict${secure}`;
      router.push("/admin");
    } catch (err) {
      const firebaseError = err as Partial<FirebaseError>;
      let message = "Error al iniciar sesion";

      switch (firebaseError.code) {
        case "auth/user-not-found":
          message = "Usuario no existe";
          break;
        case "auth/wrong-password":
          message = "Contrasena incorrecta";
          break;
        case "auth/invalid-email":
          message = "Correo invalido";
          break;
        default:
          message = err instanceof Error ? err.message : message;
      }

      setError(message);
      Alert.error("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container center maxWidth={350}>
      <Card padding="lg">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>SuperAdmin</h1>
        </div>

        <form onSubmit={handleLogin}>
          <Input
            label="Correo"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error && !email ? "Requerido" : ""}
          />

          <Input
            label="Contrasena"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={error && !password ? "Requerido" : ""}
          />

          <Button type="submit" fullWidth loading={loading}>
            Ingresar
          </Button>
        </form>
      </Card>
    </Container>
  );
}
