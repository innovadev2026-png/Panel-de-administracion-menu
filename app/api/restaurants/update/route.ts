import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const data = await req.json();

  const { id, ...rest } = data;

  await adminDb
    .collection("restaurants")
    .doc(id)
    .update(rest);

  return Response.json({ ok: true });
}