import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

const VALID_STATUSES = new Set(["active", "disabled"]);

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const { id, status } = await req.json();

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof status !== "string" ||
      !VALID_STATUSES.has(status)
    ) {
      return Response.json(
        { ok: false, error: "Solicitud invalida" },
        { status: 400 }
      );
    }

    await adminDb.collection("restaurants").doc(id).update({ status });

    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
