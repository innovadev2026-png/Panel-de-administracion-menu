import { adminDb } from "@/lib/firebaseAdmin";

type CollectionWithSubcollections = Record<
  string,
  FirebaseFirestore.DocumentData & {
    subcollections: Record<string, FirebaseFirestore.DocumentData[]>;
  }
>;

export const getCollectionWithSubcollections = async (
  collectionName: string
) => {
  const snapshot = await adminDb.collection(collectionName).get();

  const entries = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const docData = doc.data();
      const subcollections = await doc.ref.listCollections();

      const subcollectionEntries = await Promise.all(
        subcollections.map(async (sub) => {
          const subSnap = await sub.get();

          return [
            sub.id,
            subSnap.docs.map((subDoc) => ({
              id: subDoc.id,
              ...subDoc.data(),
            })),
          ] as const;
        })
      );

      return [
        doc.id,
        {
          ...docData,
          subcollections: Object.fromEntries(subcollectionEntries),
        },
      ] as const;
    })
  );

  return Object.fromEntries(entries) as CollectionWithSubcollections;
};
