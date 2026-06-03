import { NextRequest } from "next/server";
import { getCollectionWithSubcollections } from "@/lib/consulta";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const data = await getCollectionWithSubcollections("roles");
    return Response.json(data);
  } catch (error) {
    return authErrorResponse(error);
  }
}
