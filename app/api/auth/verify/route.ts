import { NextRequest } from "next/server";
import { authErrorResponse, requireAccess } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAccess(req, "dashboard");
    return Response.json({
      ok: true,
      role: user.role,
      accesses: user.accesses,
      permissions: user.permissions,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
