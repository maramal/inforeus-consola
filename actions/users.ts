"use server"

import prisma from "@/lib/prisma"
import { UserStatus, UserRole } from "@prisma/client"
import { notFound, redirect, RedirectType } from "next/navigation"
import { parseWithZod } from "@conform-to/zod"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { createUserSchema, updatePasswordSchema, updateUserSchema } from "@/schemas/users"
import { isIncluded } from "@/lib/utils"

export async function createUser(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: createUserSchema
    })

    // Validar formulario
    if (formSubmitted.status !== "success") {
        return formSubmitted.reply()
    }

    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const status = formData.get("status") as UserStatus
    const role = formData.get("role") as UserRole

    if (isIncluded(password, username)) {
        return formSubmitted.reply({
            fieldErrors: {
                password: ['La contraseña no puede contener el nombre de usuario']
            }
        })
    }

    const client = await clerkClient()

    let clerkUser = undefined

    try {
        // Crear usuario en Clerk
        clerkUser = await client.users.createUser({
            username,
            password,
        })

        if (!clerkUser) {
            throw new Error('No se pudo crear el usuario')
        }
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error(err)
        }
    }

    if (!clerkUser) {
        return formSubmitted.reply({
            formErrors: [ 'No se pudo crear el usuario' ]
        })
    }    

    // Crear usuario en base de datos
    const user = await prisma.user.create({
        data: {
            name,
            username,
            status,
            role,
            authId: clerkUser.id
        }
    })

    if (!user) {
        return formSubmitted.reply({
            formErrors: ['El usuario no se pudo crear']
        })
    }

    return redirect(`/consola/usuarios/${user.id}`)
}

export async function getUsers() {
    const users = await prisma.user.findMany()
    return users
}

export async function getUser(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    return user
}

export async function getUserByAuthId(authId: string) {
    const users = await prisma.user.findMany({
        where: {
            authId,
        },
        include: {
            stores: true
        }
    })

    return users?.[0]
}

export async function updateUser(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: updateUserSchema
    })

    // Validar formulario
    if (formSubmitted.status !== "success") {
        return formSubmitted.reply()
    }

    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as UserRole
    const status = formData.get("status") as UserStatus

    const userId = Number(id)
    if (isNaN(userId)) {
        return notFound()
    }

    // Actualizar usuario en base de datos
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name: name,
            role: role,
            status: status
        }
    })

    return redirect(`/consola/usuarios/${user.id}`)
}

export async function updateUserPassword(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: updatePasswordSchema
    })

    // Validar formulario
    if (formSubmitted.status !== "success") {
        return formSubmitted.reply()
    }

    const idString = formData.get("id") as string
    const password = formData.get("password") as string

    const id = Number(idString)
    if (isNaN(id)) {
        return formSubmitted.reply({
            formErrors: ['El usuario es inválido']
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })
    if (!user) {
        return formSubmitted.reply({
            formErrors: ['El usuario es inválido']
        })
    }

    const client = await clerkClient()
    
    const userUpdated = await client.users.updateUser(user.authId, {
        password,
    })
    if (!userUpdated) {
        return formSubmitted.reply({
            formErrors: ['No se pudo cambiar la contraseña del usuario']
        })
    }

    return redirect(`/consola/usuarios/${id}`)
}

export async function deleteUser($userId: number) {
    const { userId } = await auth()
    if (Number(userId) === $userId) {
        redirect('/consola/usuarios?delete=false', RedirectType.replace)
    }

    await prisma.user.delete({
        where: {
            id: $userId
        }
    })
}

export async function updatePassword(prevState: unknown, formData: FormData) {
    const formSubmitted = parseWithZod(formData, {
        schema: updatePasswordSchema
    })

    if (formSubmitted.status !== "success") {
        return formSubmitted.reply()
    }

    const userIdString = formData.get("id") as string
    const password = formData.get("password") as string
    
    const userId = Number(userIdString)
    const user = await getUser(userId)
    if (!user) {
        return formSubmitted.reply({
            formErrors: ["Parámetros inválidos"]
        })
    }

    const client = await clerkClient()
    
    await client.users.updateUser(user.authId, {
        password
    })

    redirect(`/consola/usuarios/${user.id}`)
}