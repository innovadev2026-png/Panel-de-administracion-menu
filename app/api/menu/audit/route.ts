import { NextRequest } from "next/server";
import { recordMenuModification } from "@/lib/menuAudit";
import { authErrorResponse, requirePermission } from "@/lib/serverAuth";

const VALID_ACTIONS = new Set([
  "price:update",
  "product:create",
  "product:delete",
]);

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission(req, "menu:audit:write");
    const body = await req.json();

    if (typeof body.action !== "string" || !VALID_ACTIONS.has(body.action)) {
      return Response.json(
        { ok: false, error: "Accion de menu invalida" },
        { status: 400 }
      );
    }

    await recordMenuModification(user, {
      action: body.action,
      productId: typeof body.productId === "string" ? body.productId : "",
      productName:
        typeof body.productName === "string" ? body.productName : "",
      before: body.before,
      after: body.after,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
