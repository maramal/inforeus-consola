import { Storage } from "@google-cloud/storage";

const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID as string,
});

const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME as string);

export async function uploadImage(image: Buffer, fileName: string) {
    // Sube el buffer directamente usando bucket.upload es otra opción, pero aquí usamos file.save.
    const fileRef = bucket.file(`stores/${fileName}`);
    await fileRef.save(image);
}

export async function deleteImage(fileUrl: string) {
    // fileUrl se espera sea la ruta relativa dentro del bucket, por ejemplo "stores/1.jpg"
    const file = bucket.file(fileUrl);
    await file.delete();
}

export async function getImage(fileUrl: string) {
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    const imageType = fileUrl.split('.').pop() ?? 'jpg';
    const base64Image = buffer.toString('base64');
    const dataURI = `data:image/${imageType};base64,${base64Image}`;

    return { dataURI, imageType };
}
