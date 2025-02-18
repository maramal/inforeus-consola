"use server"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Pen } from "lucide-react"
import { deleteStore, getStore } from "@/actions/stores"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import DeleteButton from "@/components/delete-btn"
import Image from "next/image"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

export default async function StorePage({ params }: {
    params: Promise<{ storeId: string }>
}) {
    const { storeId: storeIdString } = await params
    const storeId = Number(storeIdString)

    if (!storeId || isNaN(storeId)) {
        notFound()
    }

    const store = await getStore(storeId)
    if (!store) {
        notFound()
    }

    return (
        <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-center">
                        {store.name}
                    </h1>
                </CardHeader>
                <CardContent className="mt-5">
                    <Table>
                        <TableBody>
                            {store.logoUrl && (
                                <TableRow>
                                    <TableCell colSpan={2} className="flex justify-center py-4">
                                        <Image
                                            width={128}
                                            height={128}
                                            src={store.logoUrl}
                                            alt={store.name}
                                            className="w-32 h-32 object-cover"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell className="font-bold">Dirección:</TableCell>
                                <TableCell>{store.address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">Tienda Destacada:</TableCell>
                                <TableCell>{store.featured ? "Sí" : "No"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">Estado:</TableCell>
                                <TableCell>{store.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">Palabras clave:</TableCell>
                                <TableCell>
                                    {store.keywords && store.keywords.length > 0
                                        ? store.keywords.join(", ")
                                        : "Sin palabras clave"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4 mt-4">
                    <Button variant="default">
                        <Link className="flex items-center" href={`/tiendas/${store.id}/editar`}>
                            <Pen className="h-4 w-4 mr-1" />
                            Editar
                        </Link>
                    </Button>
                    <DeleteButton
                        itemId={store.id}
                        action={deleteStore}
                        refUrl="/tiendas"
                    />
                </CardFooter>
            </Card>
        </div>
    )
}
