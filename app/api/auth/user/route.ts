import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireAuthenticated } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const authenticatedUser = await requireAuthenticated(req);
    const { uid } = authenticatedUser;
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
      data: {
        ...docSnap.data(),
        role: authenticatedUser.role,
        restaurantId: authenticatedUser.restaurantId,
        permissions: authenticatedUser.permissions,
        accesses: authenticatedUser.accesses,
      },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
