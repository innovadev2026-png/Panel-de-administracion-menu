import { NextRequest } from "next/server";
import { getCollectionWithSubcollections } from "@/lib/consulta";
import { authErrorResponse, requireAuthenticated } from "@/lib/serverAuth";
import { ensureDefaultRoles } from "@/lib/rolePermissions";

export async function GET(req: NextRequest) {
  try {
    await requireAuthenticated(req);
    await ensureDefaultRoles();
    const data = await getCollectionWithSubcollections("roles");
    return Response.json(data);
  } catch (error) {
    return authErrorResponse(error);
  }
}
