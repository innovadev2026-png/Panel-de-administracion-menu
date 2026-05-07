"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";

// UI
import Card from "@/components/ui/Card/Card";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert/Alert";
import Spinner from "@/components/ui/Spinner/Spinner";
import Container from "@/components/ui/Container/Container";

const db = getFirestore();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos");
      Alert.error("Error", "Completa todos los campos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Usuario no registrado");
      }

      const data = userSnap.data();

      if (data.role !== "superadmin") {
        throw new Error("No autorizado");
      }

      const token = await res.user.getIdToken();

      document.cookie = `token=${token}; path=/; max-age=3600; samesite=strict`;

      router.push("/admin");
    } catch (err: any) {
      let message = "Error al iniciar sesión";

      switch (err.code) {
        case "auth/user-not-found":
          message = "Usuario no existe";
          break;
        case "auth/wrong-password":
          message = "Contraseña incorrecta";
          break;
        case "auth/invalid-email":
          message = "Correo inválido";
          break;
        default:
          message = err.message || message;
      }

      setError(message);
      Alert.error("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container center maxWidth={350}>
      <Card padding="lg" style={{ width: 380 }}>
        
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>
            SuperAdmin
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          
          <Input
            label="Correo"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={error && !email ? "Requerido" : ""}
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={error && !password ? "Requerido" : ""}
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Ingresar
          </Button>
        </form>
      </Card>
    </Container>
  );
}