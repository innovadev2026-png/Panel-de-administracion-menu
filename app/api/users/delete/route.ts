import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { adminDb, bucket } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

function logRejectedCleanup(label: string, result: PromiseSettledResult<unknown>) {
  if (result.status === "rejected") {
    console.error(label, result.reason);
  }
}

async function deleteUserFiles(id: string) {
  const [files] = await bucket.getFiles({
    prefix: `users/${id}`,
  });

  await Promise.all(files.map((file) => file.delete()));
}

export async function DELETE(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    const userRef = adminDb.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return Response.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const [storageResult, authResult] = await Promise.allSettled([
      deleteUserFiles(id),
      admin.auth().deleteUser(id),
    ]);

    logRejectedCleanup("ERROR STORAGE:", storageResult);
    logRejectedCleanup("ERROR AUTH:", authResult);

    await userRef.delete();

    return Response.json({
      ok: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error: unknown) {
    console.error("DELETE USER ERROR:", error);
    return authErrorResponse(error);
  }
}
