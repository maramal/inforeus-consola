"use client"

import { Button } from '@/components/ui/button'
import { DownloadCloud } from 'lucide-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
    // Estados para animar los contadores (números ficticios)
    const [stores, setStores] = useState(0)
    const [searches, setSearches] = useState(0)

    useEffect(() => {
        const targetStores = 120 // Número ficticio de tiendas
        const targetSearches = 5000 // Número ficticio de búsquedas
        let currentStores = 0
        let currentSearches = 0

        const interval = setInterval(() => {
            if (currentStores < targetStores) {
                currentStores += 1
                setStores(currentStores)
            }
            if (currentSearches < targetSearches) {
                currentSearches += 50
                setSearches(currentSearches)
            }
            if (currentStores >= targetStores && currentSearches >= targetSearches) {
                clearInterval(interval)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Head>
                <title>Info Reus - Encuentra tiendas en tu barrio</title>
                <meta
                    name="description"
                    content="Descubre tiendas en el barrio Reus sin recorrer cada calle. Descarga la app para Google Play y App Store."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-white flex flex-col justify-between px-4 py-8">
                <main className="max-w-4xl mx-auto text-center">
                    <div className='w-full h-screen'>
                        {/* Header: Logo y nombre de la aplicación */}
                        <header className="mb-12">
                            <Image
                                src="/Logo.svg"
                                alt="Logo"
                                width={256}
                                height={256}
                                className="mx-auto"
                            />
                            <h1 className="text-4xl font-bold mt-4">Info Reus</h1>
                        </header>

                        {/* Descripción de la aplicación */}
                        <section className="mb-16">
                            <p className="text-2xl font-semibold text-gray-700">
                                Busca tiendas en el barrio Reus sin tener que recorrer cada calle. Ingresa una palabra clave, encuentra lo que buscas y localiza la tienda en el mapa de Google.
                            </p>
                        </section>

                        {/* Botones de descarga */}
                        <section className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                            {/*<Link href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="/Google Play.png"
                                    alt="Descargar en Google Play"
                                    width={160}
                                    height={50}
                                />
                            </Link>*/}
                            <Button className="w-[300px] max-w-md flex items-center justify-center px-4 py-2">
                                <Link
                                    href="https://lateuy-my.sharepoint.com/:u:/g/personal/admin_late_uy/EQc3Aj0RavRDhyEkmJqr4qABo9Hz12NSkL4YVh5CM8bo9Q?e=q60XCR"
                                    target="_blank"
                                    className="flex items-center"
                                >
                                    <DownloadCloud size={24} className="mr-2" />
                                    <span className="text-center">
                                        Descarga directa (versión 1.0 Alpha)
                                    </span>
                                </Link>
                            </Button>

                        </section>
                    </div>

                    {/* Imagen del iPhone con la aplicación */}
                    <section className="mb-8">
                        <Image
                            src="/Aplicación Iphone.png"
                            alt="Aplicación en iPhone"
                            width={400}
                            height={800}
                            className="mx-auto"
                        />
                    </section>

                    {/* Sección de contadores */}
                    <section className="flex flex-col sm:flex-row items-center justify-around mb-8">
                        <div className="mb-4 sm:mb-0">
                            <p className="text-3xl font-bold text-indigo-600">{stores}+</p>
                            <p className="text-md text-gray-600">Tiendas</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-indigo-600">{searches}+</p>
                            <p className="text-md text-gray-600">Búsquedas</p>
                        </div>
                    </section>

                    {/* Información de la iniciativa: LATE */}
                    <section className="mb-8">
                        <p className="text-xl text-gray-800 font-medium mb-2">
                            Info Reus es una iniciativa de
                        </p>
                        <Link href="https://late.uy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-3 hover:text-blue-700">
                            <Image
                                src="/LATE.png"
                                alt="LATE"
                                width={128}
                                height={128}
                                className="object-contain"
                            />
                        </Link>
                    </section>
                </main>
            </div>
        </>
    )
}
