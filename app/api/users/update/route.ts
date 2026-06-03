import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

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
    await requireSuperAdmin(req);

    const formData = await req.formData();
    const id = getFormString(formData, "id");
    const name = getFormString(formData, "name");
    const email = getFormString(formData, "email");
    const role = getFormString(formData, "role") || "user";
    const isActive = formData.get("isActive") === "true";
    const currentImage = getFormString(formData, "currentImage");
    const file = formData.get("image") as File | null;

    if (!id) {
      return Response.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadUserImage(id, currentImage, file);
    const updateData = {
      name,
      email,
      role,
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
      admin.auth().setCustomUserClaims(id, { role }),
    ]);

    return Response.json({ ok: true });
  } catch (error: unknown) {
    console.error("UPDATE USER ERROR:", error);
    return authErrorResponse(error);
  }
}
