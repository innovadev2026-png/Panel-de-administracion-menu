import { adminDb } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import admin from "firebase-admin";

export async function POST(req: Request) {
  const body = await req.json();
  const id = uuidv4();

  const restaurant = {
    id,
    name: body.name || "Tu Restaurante",
    logo: "/images/logo.png",
    description: "descripción personalizada de tu restaurante",
    coverImage: "/images/cover.png",
    address: "Tu direccion aquí",
    phone: "Tu teléfono aquí",
    mapUrl: "",
    hours: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // ✔ correcto
    fraseHero: ["frase llamativa,", "frase destacada"],
    whatsapp: "",
    settings: {
      colors: {
        bg: "#121212",
        card: "#1a1a1a",
        text: "#ffffff",
        muted: "#aaaaaa",
        accent: "#00c853",
      },
    },
    status: "active",
  };

  await adminDb.collection("restaurants").doc(id).set(restaurant);

  return Response.json({ ok: true });
}