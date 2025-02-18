import prisma from "@/lib/prisma";

export async function createStoreSearch(keyword: string, ipAddress: string) {
    await prisma.storeSearch.create({
        data: {
            keyword,
            ipAddress
        }
    })
}

export async function getStoreSearches() {
    return await prisma.storeSearch.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
}