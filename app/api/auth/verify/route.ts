import { NextRequest } from "next/server";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
