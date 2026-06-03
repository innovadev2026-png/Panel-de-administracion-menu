import { NextRequest } from "next/server";
import { bucket } from "@/lib/firebaseAdmin";
import { authErrorResponse, requireSuperAdmin } from "@/lib/serverAuth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        {
          ok: false,
          error: "Archivo requerido",
        },
        { status: 400 }
      );
    }

    /* BUFFER */
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /* EXTENSION */
    const extension = file.name.split(".").pop();

    /* FILE NAME */
    const fileName = `uploads/${uuidv4()}.${extension}`;

    /* STORAGE FILE */
    const fileUpload = bucket.file(fileName);

    /* SAVE */
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
      public: true,
      validation: "md5",
    });

    /* PUBLIC URL */
    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return Response.json({
      ok: true,
      url,
    });

  } catch (error) {

    return authErrorResponse(error);
  }
}
