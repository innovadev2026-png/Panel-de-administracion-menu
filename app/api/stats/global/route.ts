import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  const usersSnap = await adminDb.collection("users").get();
  const restaurantsSnap = await adminDb.collection("restaurants").get();

  const totalUsers = usersSnap.size;
  const totalRestaurants = restaurantsSnap.size;

  const activeRestaurants = restaurantsSnap.docs.filter(
    (doc) => doc.data().status === "active"
  ).length;

  const disabledRestaurants = restaurantsSnap.docs.filter(
    (doc) => doc.data().status === "disabled"
  ).length;

  return Response.json({
    totalUsers,
    totalRestaurants,
    activeRestaurants,
    disabledRestaurants,
  });
}