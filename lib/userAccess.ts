import { adminDb } from "@/lib/firebaseAdmin";
import {
  ensureDefaultRoles,
  getDefaultRoleAccess,
  normalizeRole,
} from "@/lib/rolePermissions";

export type RoleAccess = {
  permissions: string[];
  accesses: string[];
};

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

async function getRoleData(role: string) {
  const canonicalRole = normalizeRole(role);
  const byName = await adminDb
    .collection("roles")
    .where("name", "==", canonicalRole)
    .limit(1)
    .get();

  if (!byName.empty) {
    return byName.docs[0].data();
  }

  const byId = await adminDb.collection("roles").doc(canonicalRole).get();
  return byId.exists ? byId.data() : null;
}

export async function getRoleAccess(role: string): Promise<RoleAccess> {
  await ensureDefaultRoles();
  const canonicalRole = normalizeRole(role);
  const roleData = await getRoleData(canonicalRole);

  if (!roleData) {
    return getDefaultRoleAccess(canonicalRole);
  }

  return {
    permissions: [
      ...normalizeStringArray(roleData.permissions),
      ...normalizeStringArray(roleData.permisos),
    ],
    accesses: [
      ...normalizeStringArray(roleData.accesses),
      ...normalizeStringArray(roleData.access),
      ...normalizeStringArray(roleData.accesos),
    ],
  };
}
