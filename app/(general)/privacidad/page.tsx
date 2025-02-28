import { getRelativeDate } from "@/lib/dates"
import Link from "next/link"

export const metadata = {
    title: "Info Reus - Política de privacidad",
    description: "Política de privacidad de Info Reus, la aplicación para encontrar tiendas en el barrio Reus."
}

const lastUpdateDate = getRelativeDate(new Date())

export default async function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Política de Privacidad
                </h1>
                <p className="mb-4 text-lg text-gray-700">
                    En Info Reus valoramos la privacidad de nuestros usuarios. Esta política
                    explica de forma clara cómo y por qué recopilamos ciertos datos al utilizar
                    nuestra aplicación.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                    Información que recopilamos
                </h2>
                <p className="mb-4 text-gray-700">
                    Cada vez que realizas una búsqueda o visitas una tienda, registramos tu
                    dirección IP. Esta información se utiliza única y exclusivamente con fines
                    estadísticos para mejorar la experiencia del usuario y optimizar nuestros
                    servicios.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Uso de la información</h2>
                <p className="mb-4 text-gray-700">
                    La dirección IP se utiliza para analizar tendencias y patrones de uso, lo
                    que nos ayuda a entender mejor cómo interactúan los usuarios con la
                    aplicación. No usamos esta información para identificarte personalmente ni
                    la compartimos con terceros.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                    No recopilamos otros datos
                </h2>
                <p className="mb-4 text-gray-700">
                    Info Reus no recopila ningún otro dato personal ni requiere permisos adicionales
                    para su funcionamiento. Nuestro único objetivo es mejorar continuamente la
                    aplicación a través de datos estadísticos.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Contacto</h2>
                <p className="mb-4 text-gray-700">
                    Si tienes alguna pregunta o inquietud sobre nuestra política de privacidad,
                    puedes contactarnos en:{" "}
                    <Link
                        href="mailto:info@late.uy"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        info@late.uy
                    </Link>
                </p>

                <p className="text-gray-600 text-sm text-center mt-8">
                    Última actualización: {lastUpdateDate}
                </p>
            </div>
        </div>
    )
}