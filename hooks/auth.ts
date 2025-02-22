"use client"

import useSWR from "swr"
import { useAuth } from "@clerk/nextjs"
import { getUserByAuthId } from "@/actions/users"


const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAuthUser() {
    const { userId } = useAuth()

    const { data, error } = useSWR(
        userId ? getUserByAuthId(userId) : null,
        fetcher
    )

    return {
        user: data,
        isLoading: !error && !data,
        error,
        userId
    }

}