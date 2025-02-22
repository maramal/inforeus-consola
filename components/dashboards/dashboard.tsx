"use server"

import { getKeywordSearches } from "@/actions/keyword-searches";
import { getAllStoreVisits } from "@/actions/store-visits";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import prisma from "@/lib/prisma";

async function getStoresCount() {
    return prisma.store.count({ where: { status: 'Activa' } });
}

export default async function Dashboard() {
    const storesCount = await getStoresCount()
    const keywordSearches = await getKeywordSearches()
    const storeVisits = await getAllStoreVisits()

    return (
        <div className="w-full mb-8">
            <p className="text-2xl font-bold mb-4">Datos generales</p>
            <div className="flex flex-row justify-around w-full">
                <Card className="w-[240px]">
                    <CardHeader className="font-bold text-center">
                        Tiendas totales
                    </CardHeader>
                    <CardContent className="text-center">
                        {storesCount}
                    </CardContent>
                </Card>

                <Card className="w-[240px]">
                    <CardHeader className="font-bold text-center">
                        Búsquedas totales
                    </CardHeader>
                    <CardContent className="text-center">
                        {keywordSearches.length}
                    </CardContent>
                </Card>

                <Card className="w-[240px]">
                    <CardHeader className="font-bold text-center">
                        Visitas totales
                    </CardHeader>
                    <CardContent className="text-center">
                        {storeVisits.length}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}