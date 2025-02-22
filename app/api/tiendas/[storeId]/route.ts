import { createStoreVisit } from "@/actions/store-visits";
import { getStore } from "@/actions/stores";
import { Store } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type GetResponse = {
    ok: boolean
    message: string
    data: Store | null
}

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
    const { storeId: storeIdString } = await params
    const response: GetResponse = {
        ok: false,
        message: 'Parámetros inválidos',
        data: null,
    }

    const storeId = Number(storeIdString)
    if (isNaN(storeId)) {
        return NextResponse.json(response)
    }

    const store = await getStore(storeId)
    if (store === null) {
        response.message = 'Tienda no encontrada'
        return NextResponse.json(response)
    }

    const ipAddress = req.headers.get('x-real-ip') || 
                      req.headers.get('x-forwarded-for') || 
                      '127.0.0.1'

    await createStoreVisit(storeId, ipAddress)
    
    response.ok = true
    response.message = ''
    response.data = store

    return NextResponse.json(response, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
}