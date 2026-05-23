import { getCollectionWithSubcollections } from "@/lib/consulta";

export async function GET() {
    const data = await getCollectionWithSubcollections('users')
    return Response.json(data)
}