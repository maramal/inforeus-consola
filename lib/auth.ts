"use server"

import { getUserByAuthId } from "@/actions/users"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function checkUserRole(route: "usuarios" | "tiendas") {
    const { redirectToSignIn, userId: authId } = await auth()
    let redirectTo = ''

    if (!authId) {
        redirectToSignIn()
    }

    const authUser = await getUserByAuthId(authId as string)

    switch (route) {
        case "usuarios":
            redirectTo = `/consola/usuarios/${authUser.id}`
            break
        case "tiendas":
            if (authUser.stores.length > 0) {
                redirectTo = `/consola/tiendas/${authUser.stores[0].id}`
            } else {
                redirectTo = '/consola'
            }
            break
        default:
            redirectTo = '/consola'
    }
    
    if (authUser.role === "Cliente") {
        redirect(redirectTo)
    }
}