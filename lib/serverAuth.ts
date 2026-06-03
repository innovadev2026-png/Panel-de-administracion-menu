import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export type AuthenticatedAdmin = {
  uid: string;
  role: string;
};

class AuthError extends Error {
  constructor(
    message: "UNAUTHORIZED" | "FORBIDDEN",
    public status: 401 | 403
  ) {
    super(message);
  }
}

export async function requireSuperAdmin(
  req: NextRequest
): Promise<AuthenticatedAdmin> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new AuthError("UNAUTHORIZED", 401);
  }

  const decoded = await adminAuth
    .verifyIdToken(token)
    .catch(() => {
      throw new AuthError("UNAUTHORIZED", 401);
    });

  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  const role = userDoc.data()?.role;

  if (!userDoc.exists || role !== "SuperAdmin") {
    throw new AuthError("FORBIDDEN", 403);
  }

  return {
    uid: decoded.uid,
    role,
  };
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      {
        ok: false,
        error: error.status === 403 ? "No autorizado" : "No autenticado",
      },
      { status: error.status }
    );
  }

  console.error("API ERROR:", error);

  return Response.json(
    { ok: false, error: "Error interno del servidor" },
    { status: 500 }
  );
}
