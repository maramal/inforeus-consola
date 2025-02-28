"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const navLinks = [
    { title: "Inicio", href: "/" },
    { title: "Política de privacidad", href: "/privacidad" },
];

export default function NavigationBar() {
    return (
        <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center space-x-2">
                <Image src="/Logo.svg" alt="Logo Info Reus" width={40} height={40} />
                <span className="font-bold text-xl">Info Reus</span>
            </div>

            {/* Enlaces en pantallas medianas y grandes */}
            <div className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="transition transform hover:scale-105 hover:text-blue-600"
                    >
                        {link.title}
                    </Link>
                ))}
            </div>

            {/* Menú dropdown para dispositivos móviles */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {navLinks.map((link) => (
                            <DropdownMenuItem key={link.href} asChild>
                                <Link href={link.href}>{link.title}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
