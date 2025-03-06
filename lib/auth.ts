"use server"

import { getUserByAuthId } from "@/actions/users"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function checkAuth() {
    const { redirectToSignIn, userId } = await auth()
    if (userId === null) {
        redirectToSignIn()
    }

    return getUserByAuthId(userId as string)
}

export async function checkUserRole(route: "usuarios" | "tiendas") {
    let redirectTo = ''

    const authUser = await checkAuth()

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