import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getCollectionWithSubcollections } from "@/lib/consulta";
import { authErrorResponse, requirePermission } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const user = await requirePermission(req, "users:view");

    if (user.role !== "SuperAdmin" && user.restaurantId) {
      const snapshot = await adminDb
        .collection("users")
        .where("restaurantId", "==", user.restaurantId)
        .get();

      return Response.json(
        Object.fromEntries(
          snapshot.docs.map((doc) => [doc.id, { id: doc.id, ...doc.data() }])
        )
      );
    }

    const data = await getCollectionWithSubcollections("users");
    return Response.json(data);
  } catch (error) {
    return authErrorResponse(error);
  }
}
