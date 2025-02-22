import prisma from "@/lib/prisma";

export async function createStoreVisit(storeId: number, ipAddress: string) {
    await prisma.storeVisit.create({
        data: {
            storeId,
            ipAddress
        }
    })
}

export async function getAllStoreVisits() {
    return await prisma.storeVisit.findMany({
        include: {
            store: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function getStoreVisits(storeId: number) {
    return await prisma.storeVisit.findMany({
        include: {
            store: true
        },
        where: {
            storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}