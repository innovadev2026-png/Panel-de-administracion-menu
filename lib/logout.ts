import { signOut } from "firebase/auth";
import { auth } from "./firebaseClient";

export const logout = async () => {
  try {
    await signOut(auth);

    // eliminar cookie del token
    document.cookie = "token=; Max-Age=0; path=/";

    // redirección
    window.location.href = "/login";
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
};