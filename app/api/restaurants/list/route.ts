import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  const snapshot = await adminDb.collection("restaurants").get();

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Response.json(data);
}