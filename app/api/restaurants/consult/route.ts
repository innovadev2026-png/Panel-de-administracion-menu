// /app/api/debug/db/route.ts
import { getCollectionWithSubcollections } from "@/lib/consulta";

export async function GET() {
  const data = await getCollectionWithSubcollections("restaurants");
  return Response.json(data);
}