import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

type FirebaseError = Error & {
  code?: string;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof Error;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop() || "jpg";
}

async function uploadUserImage(uid: string, file: File | null) {
  if (!file || file.size === 0) {
    return "/images/avatar-placeholder.png";
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(file.name);
  const fileName = `users/${uid}/${uid}.${extension}`;
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
    const email = getFormString(formData, "email");
    const password = getFormString(formData, "password");
    const role = getFormString(formData, "role") || "user";
    const isActive = formData.get("isActive") === "true";
    const file = formData.get("image") as File | null;

    if (!name || !email || !password) {
      return Response.json(
        { ok: false, error: "Nombre, email y password son requeridos" },
        { status: 400 }
      );
    }

    const authUser = await admin.auth().createUser({
      displayName: name,
      email,
      password,
      disabled: !isActive,
    });
    const uid = authUser.uid;
    const imageUrl = await uploadUserImage(uid, file);

    const user = {
      id: uid,
      uid,
      name,
      email,
      role,
      image: imageUrl,
      isActive,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await Promise.all([
      adminDb.collection("users").doc(uid).set(user),
      admin.auth().setCustomUserClaims(uid, { role }),
    ]);

    return Response.json({
      ok: true,
      user,
    });
  } catch (error: unknown) {
    console.error("CREATE USER ERROR:", error);

    if (
      isFirebaseError(error) &&
      error.code === "auth/email-already-exists"
    ) {
      return Response.json(
        { ok: false, error: "El correo ya esta registrado" },
        { status: 400 }
      );
    }

    return authErrorResponse(error);
  }
}
