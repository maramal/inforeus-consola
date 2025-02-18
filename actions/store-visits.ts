import prisma from "@/lib/prisma";

export async function createStoreVisit(storeId: number, ipAddress: string) {
    await prisma.storeVisit.create({
        data: {
            storeId,
            ipAddress
        }
    })
}

export async function getStoreVisits(storeId: number) {
    return await prisma.storeVisit.findMany({
        where: {
            storeId
        }
    })
}