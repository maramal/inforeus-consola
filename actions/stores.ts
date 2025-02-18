"use server"

import prisma from "@/lib/prisma";
import { createStoreSchema } from "@/schemas/stores";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

// Helper para guardar la imagen
async function saveLogoImage(logoData: string, storeId: number): Promise<string> {
    // Se espera un string con formato: data:image/<ext>;base64,....
    const matches = logoData.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!matches) {
        throw new Error("Formato de imagen inválido");
    }
    const ext = matches[1].split("/")[1]; // ej. png, jpg
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");
    const publicDir = path.join(process.cwd(), "public", "assets", "img", "stores");
    // Asegurarse de que el directorio existe
    await fs.mkdir(publicDir, { recursive: true });
    const imagePath = path.join(publicDir, `${storeId}.${ext}`);
    await fs.writeFile(imagePath, buffer);
    // Devolver la ruta relativa que se usará para mostrar la imagen
    return `/assets/img/stores/${storeId}.${ext}`;
}

// Helper para eliminar la imagen
async function deleteLogoImage(logoUrl: string): Promise<void> {
    if (!logoUrl) return;
    // Se asume que logoUrl es una ruta relativa que empieza con '/'
    const relativePath = logoUrl.startsWith('/') ? logoUrl.slice(1) : logoUrl;
    const filePath = path.join(process.cwd(), "public", relativePath);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
    }
}

export async function getStore(storeId: number) {
    return prisma.store.findUnique({
        where: { 
            id: storeId,
            status: 'Activa'
         }
    });
}

export async function getStores(keyword?: string) {
    if (keyword) {
        return prisma.store.findMany({
            where: {
                status: 'Activa',
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { keywords: { hasSome: [keyword] } }
                ]
            },
            orderBy: {
                name: 'asc',
            }
        });
    }

    return prisma.store.findMany();
}

export async function createStore(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: createStoreSchema
    });

    // Validar formulario
    if (formSubmitted.status !== "success") {
        return formSubmitted.reply();
    }

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const featured = formData.get("featured") === "on";
    const keywords = formData.get("keywords") as string;
    const adminId = formData.get("adminId") as string;

    const existingStore = await prisma.store.findUnique({
        where: { name }
    });
    if (existingStore) {
        return formSubmitted.reply({
            formErrors: ['La tienda ya existe']
        });
    }

    // Crear la tienda sin la imagen guardada (valor provisional)
    let store = await prisma.store.create({
        data: {
            name,
            address,
            logoUrl,
            featured,
            keywords: keywords.split(',').map((keyword: string) => keyword.trim()),
            adminId: Number(adminId)
        }
    });

    // Si se envió una imagen en formato base64, se guarda la imagen y se actualiza el logoUrl
    if (logoUrl && logoUrl.startsWith("data:image/")) {
        try {
            const savedLogoUrl = await saveLogoImage(logoUrl, store.id);
            store = await prisma.store.update({
                where: { id: store.id },
                data: { logoUrl: savedLogoUrl }
            });
        } catch (error) {
            if (error instanceof Error) {
                return formSubmitted.reply({
                    formErrors: ['Error al guardar la imagen']
                });
            }
        }
    }

    return redirect(`/tiendas/${store.id}`);
}

export async function updateStore(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: createStoreSchema
    });

    // Validar formulario
    if (formSubmitted.status !== "success") {
        return formSubmitted.reply();
    }

    const storeId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const featured = formData.get("featured") === "on";
    const keywords = formData.get("keywords") as string;
    const adminId = formData.get("adminId") as string;

    // Obtener la tienda existente para conocer la imagen anterior
    const existingStore = await prisma.store.findUnique({
        where: { id: Number(storeId) }
    });

    // Datos actualizados
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {
        name,
        address,
        featured,
        keywords: keywords.split(',').map((keyword: string) => keyword.trim()),
        adminId: Number(adminId)
    };

    // Si se envió una imagen nueva en formato base64, actualizarla
    if (logoUrl && logoUrl.startsWith("data:image/")) {
        try {
            // Si hay imagen anterior guardada, eliminarla
            if (existingStore && existingStore.logoUrl && !existingStore.logoUrl.startsWith("data:")) {
                await deleteLogoImage(existingStore.logoUrl);
            }
            const savedLogoUrl = await saveLogoImage(logoUrl, Number(storeId));
            updatedData.logoUrl = savedLogoUrl;
        } catch (error) {
            if (error instanceof Error) {
                return formSubmitted.reply({
                    formErrors: ['Error al guardar la imagen']
                });
            }
        }
    } else {
        // Si no se envía nueva imagen, se conserva la ruta actual
        updatedData.logoUrl = logoUrl;
    }

    const store = await prisma.store.update({
        where: { id: Number(storeId) },
        data: updatedData
    });
    if (!store) {
        return formSubmitted.reply({
            formErrors: ['No se pudo actualizar la tienda']
        });
    }

    return redirect(`/tiendas/${store.id}`);
}

export async function deleteStore(storeId: number) {
    // Primero, obtener la tienda para extraer la ruta del logo
    const store = await prisma.store.findUnique({
        where: { id: storeId }
    });
    if (!store) {
        return {
            status: 500,
            body: { error: 'No se pudo encontrar la tienda' }
        };
    }

    // Eliminar el registro de la tienda en la BD
    await prisma.store.delete({
        where: { id: storeId }
    });

    // Eliminar la imagen del logo si existe
    if (store.logoUrl) {
        await deleteLogoImage(store.logoUrl);
    }

    return redirect(`/tiendas`);
}
