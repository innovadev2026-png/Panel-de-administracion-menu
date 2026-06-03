import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

const DEFAULT_COLORS = {
  bg: "#121212",
  card: "#1a1a1a",
  text: "#ffffff",
  muted: "#aaaaaa",
  accent: "#00c853",
};

function getFormString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function parseSettings(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return { colors: DEFAULT_COLORS };
  }

  try {
    const parsed = JSON.parse(value) as { colors?: Record<string, string> };

    return {
      ...parsed,
      colors: {
        ...DEFAULT_COLORS,
        ...parsed.colors,
      },
    };
  } catch {
    return { colors: DEFAULT_COLORS };
  }
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop() || "jpg";
}

async function uploadRestaurantImage(
  restaurantId: string,
  field: "logo" | "coverImage",
  file: File | null
) {
  if (!file || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(file.name);
  const fileName = `restaurants/${restaurantId}/${field}.${extension}`;
  const storageFile = bucket.file(fileName);

  await storageFile.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const formData = await req.formData();
    const name = getFormString(formData, "name");

    if (!name) {
      return Response.json(
        { ok: false, error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const [logoUrl, coverImageUrl] = await Promise.all([
      uploadRestaurantImage(id, "logo", formData.get("logoFile") as File | null),
      uploadRestaurantImage(
        id,
        "coverImage",
        formData.get("coverImageFile") as File | null
      ),
    ]);

    const restaurant = {
      id,
      name,
      logo: logoUrl || getFormString(formData, "logo", "/images/logo.png"),
      description: getFormString(
        formData,
        "description",
        "descripcion personalizada de tu restaurante"
      ),
      coverImage:
        coverImageUrl || getFormString(formData, "coverImage", "/images/cover.png"),
      address: getFormString(formData, "address", "Tu direccion aqui"),
      phone: getFormString(formData, "phone", "Tu telefono aqui"),
      mapUrl: getFormString(formData, "mapUrl"),
      hours: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      fraseHero: ["frase llamativa", "frase destacada"],
      whatsapp: getFormString(formData, "whatsapp"),
      settings: parseSettings(formData.get("settings")),
      status: "active",
    };

    await adminDb.collection("restaurants").doc(id).set(restaurant);

    return Response.json({ ok: true, id });
  } catch (error) {
    return authErrorResponse(error);
  }
}
