import prisma from "@/lib/prisma";

export async function createKeywordSearch(keyword: string, ipAddress: string) {
    await prisma.keywordSearch.create({
        data: {
            keyword,
            ipAddress
        }
    })
}

export async function getKeywordSearches() {
    return await prisma.keywordSearch.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
}