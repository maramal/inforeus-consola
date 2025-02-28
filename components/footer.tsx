"use client"

import Image from "next/image"
import Link from "next/link"

const siteUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://inforeus.uy'

export default function Footer() {
    return (
        <footer className="border-t pt-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <Image
                        src="/Logo.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                    <div className="text-sm text-gray-600">
                        <p><Link href="mailto:info@late.uy" target="_blank">info@late.uy</Link></p>
                        <p><Link href="https://wa.me/+59892552793" target="_blank">092 552 793</Link></p>
                    </div>
                </div>
                <div>
                    <Link href={`${siteUrl}/consola`} className="text-sm text-blue-500 underline hover:text-blue-700">
                        Acceso a Consola
                    </Link>
                </div>
            </div>
        </footer>
    )
}