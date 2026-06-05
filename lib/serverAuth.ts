import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { getDefaultRoleAccess, normalizeRole } from "@/lib/rolePermissions";

export type AuthenticatedAdmin = {
  uid: string;
  role: string;
  restaurantId?: string;
  permissions: string[];
  accesses: string[];
};

class AuthError extends Error {
  constructor(
    message: "UNAUTHORIZED" | "FORBIDDEN",
    public status: 401 | 403
  ) {
    super(message);
  }
}

export async function requireSuperAdmin(
  req: NextRequest
): Promise<AuthenticatedAdmin> {
  const user = await requireAuthenticated(req);

  if (user.role !== "SuperAdmin") {
    throw new AuthError("FORBIDDEN", 403);
  }

  return user;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getRequestToken(req: NextRequest) {
  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return "";

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuthenticated(
  req: NextRequest
): Promise<AuthenticatedAdmin> {
  const token = getRequestToken(req);

  if (!token) {
    throw new AuthError("UNAUTHORIZED", 401);
  }

  const decoded = await adminAuth
    .verifyIdToken(token)
    .catch(() => {
      throw new AuthError("UNAUTHORIZED", 401);
    });

  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  const userData = userDoc.data();
  const role =
    typeof userData?.role === "string" ? normalizeRole(userData.role) : "";

  if (!userDoc.exists || !role) {
    throw new AuthError("FORBIDDEN", 403);
  }

  const fallbackAccess = getDefaultRoleAccess(role);
  const permissions = normalizeStringArray(userData?.permissions);
  const accesses = normalizeStringArray(userData?.accesses);

  return {
    uid: decoded.uid,
    role,
    restaurantId:
      typeof userData?.restaurantId === "string" ? userData.restaurantId : "",
    permissions: permissions.length ? permissions : [...fallbackAccess.permissions],
    accesses: accesses.length ? accesses : [...fallbackAccess.accesses],
  };
}

export async function requirePermission(
  req: NextRequest,
  permission: string
): Promise<AuthenticatedAdmin> {
  const user = await requireAuthenticated(req);

  if (user.role === "SuperAdmin" || user.permissions.includes("*")) {
    return user;
  }

  if (!user.permissions.includes(permission)) {
    throw new AuthError("FORBIDDEN", 403);
  }

  return user;
}

export async function requireAccess(
  req: NextRequest,
  access: string
): Promise<AuthenticatedAdmin> {
  const user = await requireAuthenticated(req);

  if (
    user.role === "SuperAdmin" ||
    user.accesses.includes("*") ||
    user.accesses.includes(access)
  ) {
    return user;
  }

  throw new AuthError("FORBIDDEN", 403);
}

export function assertRestaurantAccess(
  user: AuthenticatedAdmin,
  restaurantId: string
) {
  if (user.role === "SuperAdmin" || user.permissions.includes("*")) return;

  if (!user.restaurantId || user.restaurantId !== restaurantId) {
    throw new AuthError("FORBIDDEN", 403);
  }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      {
        ok: false,
        error: error.status === 403 ? "No autorizado" : "No autenticado",
      },
      { status: error.status }
    );
  }

  console.error("API ERROR:", error);

  return Response.json(
    { ok: false, error: "Error interno del servidor" },
    { status: 500 }
  );
}
