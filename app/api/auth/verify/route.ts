import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return Response.json({ ok: false }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists || userDoc.data()?.role !== "superadmin") {
      return Response.json({ ok: false }, { status: 403 });
    }

    return Response.json({ ok: true });

  } catch {
    return Response.json({ ok: false }, { status: 401 });
  }
}