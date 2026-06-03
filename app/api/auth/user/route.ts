import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const { uid } = await requireSuperAdmin(req);
    const docSnap = await adminDb.collection("users").doc(uid).get();

    if (!docSnap.exists) {
      return Response.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      uid,
      data: docSnap.data(),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
