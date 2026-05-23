// /app/api/users/delete/route.ts

import { adminDb, bucket } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export async function DELETE(req: Request) {
  try {

    const { id } = await req.json();

    /* VALIDACIÓN */
    if (!id) {
      return Response.json(
        {
          ok: false,
          error: "ID requerido",
        },
        { status: 400 }
      );
    }

    /* =====================================
       GET USER
    ===================================== */

    const userRef = adminDb
      .collection("users")
      .doc(id);

    const userSnap =
      await userRef.get();

    if (!userSnap.exists) {
      return Response.json(
        {
          ok: false,
          error: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    const user =
      userSnap.data();

    /* =====================================
       DELETE IMAGE STORAGE
    ===================================== */

    try {

      const files =
        await bucket.getFiles({
          prefix: `users/${id}`,
        });

      if (
        files &&
        files[0] &&
        files[0].length > 0
      ) {

        await Promise.all(
          files[0].map((file) =>
            file.delete()
          )
        );
      }

    } catch (storageError) {

      console.error(
        "ERROR STORAGE:",
        storageError
      );
    }

    /* =====================================
       DELETE AUTH
    ===================================== */

    try {

      await admin
        .auth()
        .deleteUser(id);

    } catch (authError) {

      console.error(
        "ERROR AUTH:",
        authError
      );
    }

    /* =====================================
       DELETE FIRESTORE
    ===================================== */

    await userRef.delete();

    return Response.json({
      ok: true,
      message:
        "Usuario eliminado correctamente",
    });

  } catch (error: any) {

    console.error(
      "DELETE USER ERROR:",
      error
    );

    return Response.json(
      {
        ok: false,
        error:
          error.message ||
          "Error eliminando usuario",
      },
      { status: 500 }
    );
  }
}