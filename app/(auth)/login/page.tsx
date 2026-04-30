"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";


const db = getFirestore();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setError("Usuario no registrado");
      return;
    }

    const data = userSnap.data();

    if (data.role !== "superadmin") {
      setError("No autorizado");
      return;
    }

    // 🔑 obtener token
    const token = await res.user.getIdToken();

    // 🔐 guardarlo en cookie
    document.cookie = `token=${token}; path=/`;

    router.push("/admin");

  } catch {
    setError("Credenciales inválidas");
  }
}; 

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h1 className={styles.title}>SuperAdmin</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Ingresar
        </button>
      </form>
    </div>
  );
}