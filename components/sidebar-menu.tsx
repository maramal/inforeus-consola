"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Home, Users, Menu, Store } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { getUserByAuthId } from "@/actions/users";

type NavigationLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const links: NavigationLink[] = [
  {
    name: "Inicio",
    href: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Tiendas",
    href: "/tiendas",
    icon: <Store className="w-5 h-5" />,
  }
];

const SidebarMenu: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Estado para controlar si el sidebar está colapsado
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const width = collapsed ? "w-20" : "w-64";

  // Usamos el hook de Clerk para obtener la información del usuario
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUserByAuthId(userId as string)
      setUser(user)
    }
    if (userId) {
      fetchUser()
    }
  }, [userId])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${width}`}>
      <div className="flex flex-col h-full">
        {/* Encabezado del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && <h1 className="text-lg font-bold">Info Reus - Consola</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Menú de navegación */}
        <div className="flex-1 overflow-y-auto">
          <NavigationMenu className="w-full">
            <div className="w-full">
              <NavigationMenuList className="flex flex-col w-full">
                {links.map((link, index) => (
                  <NavigationMenuItem key={index} className="w-full">
                    <Link href={link.href}>
                      <div
                        className={`w-full flex items-center p-4 cursor-pointer transition-colors hover:underline ${collapsed ? "justify-center" : ""
                          }`}
                      >
                        <span className={collapsed ? "" : "mr-3"}>{link.icon}</span>
                        {!collapsed && <span className="whitespace-nowrap">{link.name}</span>}
                      </div>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </div>
          </NavigationMenu>
        </div>

        {/* Sección de usuario con información de Clerk */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <UserButton />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap ml-2">
                {user?.name || 'Usuario'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
