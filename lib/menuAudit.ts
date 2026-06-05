import admin from "firebase-admin";
import { adminDb } from "@/lib/firebaseAdmin";
import { AuthenticatedAdmin } from "@/lib/serverAuth";

type MenuAuditInput = {
  action: "price:update" | "product:create" | "product:delete";
  productId?: string;
  productName?: string;
  before?: unknown;
  after?: unknown;
};

export async function recordMenuModification(
  user: AuthenticatedAdmin,
  input: MenuAuditInput
) {
  if (!user.restaurantId) {
    throw new Error("RESTAURANT_REQUIRED");
  }

  await adminDb.collection("menu modifications").add({
    restaurantId: user.restaurantId,
    userId: user.uid,
    userRole: user.role,
    action: input.action,
    productId: input.productId || "",
    productName: input.productName || "",
    before: input.before ?? null,
    after: input.after ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
