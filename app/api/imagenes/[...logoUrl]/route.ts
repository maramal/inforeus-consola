import { getImage } from "@/lib/storage"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ logoUrl: string[] }> }) {
    const { logoUrl } = await params

    const fileUrl = logoUrl.join('/')

    const { dataURI, imageType } = await getImage(fileUrl)    

    const headers = new Headers();
    headers.append('Content-Type', imageType);
    
    const buffer = Buffer.from(dataURI.split(',')[1], 'base64');

    return new NextResponse(buffer, {
        status: 200,
        headers
    });
}