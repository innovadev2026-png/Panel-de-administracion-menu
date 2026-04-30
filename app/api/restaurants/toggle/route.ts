import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const { id, status } = await req.json();

  await adminDb
    .collection("restaurants")
    .doc(id)
    .update({ status });

  return Response.json({ ok: true });
}