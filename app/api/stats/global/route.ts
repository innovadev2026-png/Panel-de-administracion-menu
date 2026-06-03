import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

async function getCount(query: FirebaseFirestore.Query) {
  const snapshot = await query.count().get();
  return snapshot.data().count;
}

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const [
      totalUsers,
      totalRestaurants,
      activeRestaurants,
      disabledRestaurants,
    ] = await Promise.all([
      getCount(adminDb.collection("users")),
      getCount(adminDb.collection("restaurants")),
      getCount(adminDb.collection("restaurants").where("status", "==", "active")),
      getCount(
        adminDb.collection("restaurants").where("status", "==", "disabled")
      ),
    ]);

    return Response.json({
      totalUsers,
      totalRestaurants,
      activeRestaurants,
      disabledRestaurants,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
