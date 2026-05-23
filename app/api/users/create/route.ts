// /app/api/users/create/route.ts

import { adminDb, bucket } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {

    /* FORM DATA */
    const formData = await req.formData();

    const name =
      formData.get("name") as string;

    const email =
      formData.get("email") as string;

    const password =
      formData.get("password") as string;

    const role =
      formData.get("role") as string;

    const isActive =
      formData.get("isActive") === "true";

    const file =
      formData.get("image") as File | null;

    /* VALIDATION */
    if (!name || !email || !password) {
      return Response.json(
        {
          ok: false,
          error:
            "Nombre, email y password son requeridos",
        },
        { status: 400 }
      );
    }

    /* =========================
       CREATE AUTH USER
    ========================== */

    const authUser =
      await admin.auth().createUser({
        displayName: name,
        email,
        password,
        disabled: !isActive,
      });

    /* UID FIREBASE AUTH */
    const uid = authUser.uid;

    /* =========================
       IMAGE
    ========================== */

    let imageUrl =
      "/images/avatar-placeholder.png";

    if (file && file.size > 0) {

      const bytes =
        await file.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      const extension =
        file.name.split(".").pop();

      const fileName =
        `users/${uid}/${uid}.${extension}`;

      const storageFile =
        bucket.file(fileName);

      await storageFile.save(buffer, {
        metadata: {
          contentType: file.type,
        },
        public: true,
      });

      imageUrl =
        `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* =========================
       FIRESTORE USER
    ========================== */

    const user = {
      id: uid,

      uid,

      name,

      email,

      role: role || "user",

      image: imageUrl,

      isActive,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),
    };

    await adminDb
      .collection("users")
      .doc(uid)
      .set(user);

    /* =========================
       CUSTOM CLAIMS
    ========================== */

    await admin.auth().setCustomUserClaims(
      uid,
      {
        role: role || "user",
      }
    );

    return Response.json({
      ok: true,
      user,
    });

  } catch (error: any) {

    console.error(
      "CREATE USER ERROR:",
      error
    );

    /* FIREBASE AUTH ERRORS */
    if (
      error.code ===
      "auth/email-already-exists"
    ) {
      return Response.json(
        {
          ok: false,
          error:
            "El correo ya está registrado",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        ok: false,
        error:
          error.message ||
          "Error creando usuario",
      },
      { status: 500 }
    );
  }
}