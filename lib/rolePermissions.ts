import admin from "firebase-admin";
import { adminDb } from "@/lib/firebaseAdmin";

export const ROLE_PERMISSIONS = {
  SuperAdmin: {
    permissions: ["*"],
    accesses: ["dashboard", "restaurant", "restaurants", "users", "menu", "settings"],
  },
  Admin: {
    permissions: [
      "dashboard:view",
      "restaurant:view",
      "restaurant:update",
      "users:view",
      "users:manage",
      "menu:view",
      "menu:update",
    ],
    accesses: ["dashboard", "restaurant", "users", "menu"],
  },
  Operador: {
    permissions: [
      "dashboard:view",
      "restaurant:view",
      "menu:view",
      "menu:price:update",
      "menu:product:create",
      "menu:product:delete",
      "menu:audit:write",
    ],
    accesses: ["dashboard", "menu"],
  },
  Owner: {
    permissions: ["dashboard:view", "restaurant:view", "menu:view"],
    accesses: ["dashboard", "restaurant", "menu"],
  },
} as const;

export type AppRole = keyof typeof ROLE_PERMISSIONS;

export function normalizeRole(role: string) {
  const normalized = role.trim().toLowerCase();

  if (normalized === "superadmin" || normalized === "super admin") {
    return "SuperAdmin";
  }

  if (normalized === "admin") {
    return "Admin";
  }

  if (normalized === "operador" || normalized === "operator") {
    return "Operador";
  }

  if (normalized === "owner") {
    return "Owner";
  }

  return role;
}

export function isAppRole(role: string): role is AppRole {
  return role in ROLE_PERMISSIONS;
}

export function getDefaultRoleAccess(role: string) {
  const canonicalRole = normalizeRole(role);

  if (!isAppRole(canonicalRole)) {
    return {
      permissions: [],
      accesses: [],
    };
  }

  const access = ROLE_PERMISSIONS[canonicalRole];

  return {
    permissions: [...access.permissions],
    accesses: [...access.accesses],
  };
}

export async function ensureDefaultRoles() {
  await Promise.all(
    Object.entries(ROLE_PERMISSIONS).map(([name, access]) =>
      adminDb
        .collection("roles")
        .doc(name)
        .set(
          {
            id: name,
            name,
            permissions: access.permissions,
            accesses: access.accesses,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
    )
  );
}
