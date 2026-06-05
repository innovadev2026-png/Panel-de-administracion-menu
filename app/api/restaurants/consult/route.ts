import { NextRequest } from "next/server";
import { getCollectionWithSubcollections } from "@/lib/consulta";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireAuthenticated } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthenticated(req);

    if (user.role !== "SuperAdmin" && user.restaurantId) {
      const doc = await adminDb.collection("restaurants").doc(user.restaurantId).get();
      return Response.json(doc.exists ? { [doc.id]: doc.data() } : {});
    }

    const data = await getCollectionWithSubcollections("restaurants");
    return Response.json(data);
  } catch (error) {
    return authErrorResponse(error);
  }
}
