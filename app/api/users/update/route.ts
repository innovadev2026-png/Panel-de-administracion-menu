import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import {
  assertRestaurantAccess,
  authErrorResponse,
  requirePermission,
} from "@/lib/serverAuth";
import { getRoleAccess } from "@/lib/userAccess";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop() || "jpg";
}

async function uploadUserImage(
  id: string,
  currentImage: string,
  file: File | null
) {
  if (!file || file.size === 0) {
    return currentImage || "/images/avatar-placeholder.png";
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(file.name);
  const fileName = `users/${id}/${id}.${extension}`;
  const storageFile = bucket.file(fileName);

  await storageFile.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export async function PUT(req: NextRequest) {
  try {
    const authenticatedUser = await requirePermission(req, "users:manage");

    const formData = await req.formData();
    const id = getFormString(formData, "id");
    const name = getFormString(formData, "name");
    const email = getFormString(formData, "email");
    const role = getFormString(formData, "role") || "user";
    const restaurantId = getFormString(formData, "restaurantId");
    const isActive = formData.get("isActive") === "true";
    const currentImage = getFormString(formData, "currentImage");
    const file = formData.get("image") as File | null;

    if (!id) {
      return Response.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    if (!restaurantId) {
      return Response.json(
        { ok: false, error: "Restaurante requerido" },
        { status: 400 }
      );
    }

    const [restaurantSnap, access] = await Promise.all([
      adminDb.collection("restaurants").doc(restaurantId).get(),
      getRoleAccess(role),
    ]);

    assertRestaurantAccess(authenticatedUser, restaurantId);

    if (!restaurantSnap.exists) {
      return Response.json(
        { ok: false, error: "Restaurante no encontrado" },
        { status: 404 }
      );
    }

    const imageUrl = await uploadUserImage(id, currentImage, file);
    const restaurantName = restaurantSnap.data()?.name || "";
    const updateData = {
      name,
      email,
      role,
      restaurantId,
      restaurantName,
      permissions: access.permissions,
      accesses: access.accesses,
      image: imageUrl,
      isActive,
      updatedAt: new Date(),
    };

    await Promise.all([
      adminDb.collection("users").doc(id).update(updateData),
      admin.auth().updateUser(id, {
        displayName: name,
        email,
        disabled: !isActive,
      }),
      admin.auth().setCustomUserClaims(id, {
        role,
        restaurantId,
        permissions: access.permissions,
        accesses: access.accesses,
      }),
    ]);

    return Response.json({ ok: true });
  } catch (error: unknown) {
    console.error("UPDATE USER ERROR:", error);
    return authErrorResponse(error);
  }
}
