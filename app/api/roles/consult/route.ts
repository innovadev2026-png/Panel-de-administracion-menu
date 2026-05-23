import { getCollectionWithSubcollections } from "@/lib/consulta";

export async function GET() {
  const data = await getCollectionWithSubcollections("roles");
  return Response.json(data);
}