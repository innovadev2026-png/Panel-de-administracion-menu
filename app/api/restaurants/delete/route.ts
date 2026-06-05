import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

export async function DELETE(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const { id } = await req.json();

    if (typeof id !== "string" || !id.trim()) {
      return Response.json(
        { ok: false, error: "Id de restaurante invalido" },
        { status: 400 }
      );
    }

    const restaurantRef = adminDb.collection("restaurants").doc(id);
    const deletedRef = adminDb.collection("restaurant delete").doc(id);

    await adminDb.runTransaction(async (transaction) => {
      const restaurantSnap = await transaction.get(restaurantRef);

      if (!restaurantSnap.exists) {
        throw new Error("NOT_FOUND");
      }

      transaction.set(deletedRef, {
        ...restaurantSnap.data(),
        originalId: id,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      transaction.delete(restaurantRef);
    });

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return Response.json(
        { ok: false, error: "Restaurante no encontrado" },
        { status: 404 }
      );
    }

    return authErrorResponse(error);
  }
}
