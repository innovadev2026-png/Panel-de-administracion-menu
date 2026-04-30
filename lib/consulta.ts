import { adminDb } from "@/lib/firebaseAdmin";

export const getCollectionWithSubcollections = async (
  collectionName: string
) => {
  const result: any = {};

  const snapshot = await adminDb.collection(collectionName).get();

  for (const doc of snapshot.docs) {
    const docData = doc.data();

    result[doc.id] = {
      ...docData,
      subcollections: {},
    };

    // listar subcolecciones del documento
    const subcollections = await doc.ref.listCollections();

    for (const sub of subcollections) {
      const subSnap = await sub.get();

      result[doc.id].subcollections[sub.id] = subSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    }
  }

  return result;
};