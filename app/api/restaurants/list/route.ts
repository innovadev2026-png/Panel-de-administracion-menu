import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const snapshot = await adminDb
      .collection("restaurants")
      .orderBy("createdAt", "desc")
      .get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(data);
  } catch (error) {
    return authErrorResponse(error);
  }
}
