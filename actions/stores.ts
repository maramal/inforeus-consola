"use server"

import prisma from "@/lib/prisma";
import { updateStoreSchema } from "@/schemas/stores";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/storage";

const siteUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://inforeus.uy';

// Helper para subir la imagen a Google Cloud Storage usando bucket.upload (aquí usamos file.save con buffer)
async function saveLogoImage(logoData: string, storeId: number): Promise<string> {
    // Se espera que logoData tenga el formato: data:image/<ext>;base64,....
    const matches = logoData.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!matches) {
        throw new Error("Formato de imagen inválido");
    }

    const ext = matches[1].split("/")[1]; // ej. png, jpg
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");

    const fileName = `${storeId}.${ext}`;
    await uploadImage(buffer, fileName);

    return `${siteUrl}/api/imagenes/stores/${fileName}`;
}

// Helper para eliminar la imagen desde Google Cloud Storage
async function deleteLogoImage(logoUrl: string): Promise<void> {
    if (!logoUrl) return;
    // Se asume que la URL tiene la forma: https://storage.googleapis.com/<bucketName>/stores/<fileName>
    const parts = logoUrl.split("/api/imagenes/stores/");
    if (parts.length < 2) return;
    const filePath = `stores/${parts[1]}`;
    try {
        await deleteImage(filePath);
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

// Función para obtener el valor de logoUrl como string
async function getLogoString(logoValue: FormDataEntryValue | null): Promise<string> {
    if (!logoValue) return "";
    if (typeof logoValue === "string") {
        return logoValue;
    } else {
        // Asumimos que es un File (o Blob)
        const file = logoValue as File;
        const buffer = Buffer.from(await file.arrayBuffer());
        const mimeType = file.type; // e.g., "image/png"
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
}

export async function createStore(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: updateStoreSchema
    });

    if (formSubmitted.status !== "success") {
        return formSubmitted.reply();
    }

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const logoValue = formData.get("logoUrl");
    const logoString = await getLogoString(logoValue);
    const featured = formData.get("featured") === "on";
    const keywords = formData.get("keywords") as string;
    const website = formData.get("website") as string;
    const adminId = formData.get("adminId") as string;

    const existingStore = await prisma.store.findUnique({
        where: { name }
    });
    if (existingStore) {
        return formSubmitted.reply({
            formErrors: ['La tienda ya existe']
        });
    }

    // Crear la tienda con valor provisional para logoUrl
    let store = await prisma.store.create({
        data: {
            name,
            address,
            logoUrl: '',
            featured,
            keywords: keywords.split(',').map((keyword: string) => keyword.trim()),
            website,
            adminId: Number(adminId)
        }
    });

    // Si se envió una imagen en formato base64, se sube al bucket y se actualiza el logoUrl
    if (logoString && logoString.startsWith("data:image/")) {
        try {
            const savedLogoUrl = await saveLogoImage(logoString, store.id);
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

    return redirect(`/consola/tiendas/${store.id}`);
}

export async function updateStore(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: updateStoreSchema,
    });

    if (formSubmitted.status !== "success") {
        return formSubmitted.reply();
    }

    const storeId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const logoValue = formData.get("logoUrl");
    const logoString = await getLogoString(logoValue);
    const featured = formData.get("featured") === "on";
    const keywords = formData.get("keywords") as string;
    const website = formData.get("website") as string;
    const adminId = formData.get("adminId") as string;

    const existingStore = await prisma.store.findUnique({
        where: { id: Number(storeId) }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {
        name,
        address,
        featured,
        keywords: keywords.split(',').map((keyword: string) => keyword.trim()),
        website,
        adminId: Number(adminId),
    };

    if (logoString && logoString.startsWith("data:image/")) {
        try {
            if (existingStore && existingStore.logoUrl && !existingStore.logoUrl.startsWith("data:")) {
                await deleteLogoImage(existingStore.logoUrl);
            }
            const savedLogoUrl = await saveLogoImage(logoString, Number(storeId));
            updatedData.logoUrl = savedLogoUrl;
        } catch (error) {
            if (error instanceof Error) {
                return formSubmitted.reply({
                    formErrors: ['Error al guardar la imagen']
                });
            }
        }
    }

    const store = await prisma.store.update({
        where: { id: Number(storeId) },
        data: updatedData,
    });
    if (!store) {
        return formSubmitted.reply({
            formErrors: ['No se pudo actualizar la tienda'],
        });
    }

    return redirect(`/consola/tiendas/${store.id}`);
}

export async function deleteStore(storeId: number) {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
    });
    if (!store) {
        return {
            status: 500,
            body: { error: 'No se pudo encontrar la tienda' },
        };
    }

    await prisma.store.delete({
        where: { id: storeId },
    });

    if (store.logoUrl) {
        await deleteLogoImage(store.logoUrl);
    }

    return redirect(`/consola/tiendas`);
}
