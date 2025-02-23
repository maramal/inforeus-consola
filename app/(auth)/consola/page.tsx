"use server"

import { getUserByAuthId } from "@/actions/users"
import AdminDashboard from "@/components/dashboards/admin/admin-dashboard"
import CustomerDashboard from "@/components/dashboards/customer/customer-dashboard"
import Dashboard from "@/components/dashboards/dashboard"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

export default async function HomePage() {
    const { userId: authId, redirectToSignIn } = await auth()
    if (!authId) {
        return redirectToSignIn()
    }

    const user = await getUserByAuthId(authId)
    if (!user) {
        return notFound()
    }

    return (
        <>
            <Dashboard />
            {user.role === 'Administrador'
                ? <AdminDashboard />
                : (
                    user.stores.length > 0
                        ? <CustomerDashboard storeId={user.stores[0].id} />
                        : <p>No hay datos para mostrar.</p>
                )
            }
        </>
    )
}