import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireAuthenticated } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthenticated(req);

    if (user.role !== "SuperAdmin" && user.restaurantId) {
      const doc = await adminDb.collection("restaurants").doc(user.restaurantId).get();

      return Response.json(doc.exists ? [{ id: doc.id, ...doc.data() }] : []);
    }

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
