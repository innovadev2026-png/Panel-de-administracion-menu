import { adminDb, bucket } from "@/lib/firebaseAdmin";

export async function PUT(req: Request) {
  try {

    const formData = await req.formData();

    const id =
      formData.get("id") as string;

    const name =
      formData.get("name") as string;

    const email =
      formData.get("email") as string;

    const role =
      formData.get("role") as string;

    const isActive =
      formData.get("isActive") === "true";

    const currentImage =
      formData.get("currentImage") as string;

    const file =
      formData.get("image") as File | null;

    if (!id) {
      return Response.json(
        {
          ok: false,
          error: "ID requerido",
        },
        { status: 400 }
      );
    }

    /* IMAGE */
    let imageUrl =
      currentImage ||
      "/images/avatar-placeholder.png";

    /* NUEVA IMAGEN */
    if (file && file.size > 0) {

      const bytes =
        await file.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      const extension =
        file.name.split(".").pop();

      const fileName =
        `users/${id}/${id}.${extension}`;

      const storageFile =
        bucket.file(fileName);

      await storageFile.save(buffer, {
        metadata: {
          contentType: file.type,
        },
        public: true,
      });

      imageUrl =
        `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* UPDATE */
    const updateData = {
      name,
      email,
      role,
      image: imageUrl,
      isActive,
      updatedAt: new Date(),
    };

    await adminDb
      .collection("users")
      .doc(id)
      .update(updateData);

    return Response.json({
      ok: true,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        ok: false,
        error: "Error actualizando usuario",
      },
      { status: 500 }
    );
  }
}