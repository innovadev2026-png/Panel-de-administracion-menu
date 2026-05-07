// /app/api/me/route.ts

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    // ===== Token =====
    const cookie = req.headers.get("cookie") || "";

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return Response.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // ===== Verify Token =====
    const decoded = await adminAuth.verifyIdToken(token);

    const uid = decoded.uid;

    // ===== Get User =====
    const docRef = adminDb.collection("users").doc(uid);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return Response.json(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // ===== Data =====
    const data = docSnap.data();

    // ===== Response =====
    return Response.json({
      ok: true,
      uid,
      data,
    });

  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        error: error.message || "Error interno",
      },
      { status: 500 }
    );
  }
}