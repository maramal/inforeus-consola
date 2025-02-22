import { createKeywordSearch } from "@/actions/keyword-searches"
import { getStores } from "@/actions/stores"
import { Store } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('k') || ''
    const keywords = query.split(' ').filter(Boolean).join(' ')
    
    let stores: Store[] = []

    if (keywords) {
        const ipAddress = req.headers.get('x-real-ip') || 
                          req.headers.get('x-forwarded-for') || 
                          '127.0.0.1'
        await createKeywordSearch(keywords, ipAddress)

        stores = await getStores(keywords as string)
    } else {
        stores = await getStores()
    }

    return NextResponse.json({ stores }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
}