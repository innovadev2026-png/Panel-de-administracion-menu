import { NextRequest } from "next/server";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import {
  assertRestaurantAccess,
  authErrorResponse,
  requirePermission,
} from "@/lib/serverAuth";

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
  if (typeof value !== "string") return undefined;

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
    return undefined;
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
    const user = await requirePermission(req, "restaurant:update");

    const formData = await req.formData();
    const id = getFormString(formData, "id");

    if (!id) {
      return Response.json(
        { ok: false, error: "Id de restaurante invalido" },
        { status: 400 }
      );
    }

    assertRestaurantAccess(user, id);

    const [logoUrl, coverImageUrl] = await Promise.all([
      uploadRestaurantImage(id, "logo", formData.get("logoFile") as File | null),
      uploadRestaurantImage(
        id,
        "coverImage",
        formData.get("coverImageFile") as File | null
      ),
    ]);
    const settings = parseSettings(formData.get("settings"));

    const updateData: Record<string, unknown> = {
      name: getFormString(formData, "name"),
      description: getFormString(formData, "description"),
      address: getFormString(formData, "address"),
      phone: getFormString(formData, "phone"),
      logo: logoUrl || getFormString(formData, "logo"),
      coverImage: coverImageUrl || getFormString(formData, "coverImage"),
    };

    if (settings) {
      updateData.settings = settings;
    }

    await adminDb.collection("restaurants").doc(id).update(updateData);

    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
