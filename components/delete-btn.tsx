"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type variantType = "destructive" | "link" | "default" | "outline" | "secondary" | "ghost" | null | undefined

export default function DeleteButton({
    action,
    itemId,
    refUrl,
    className,
    variant = "destructive",
    disabled = false
}: {
    action: (itemId: number) => void
    itemId: number
    refUrl: string
    className?: string
    variant?: variantType
    disabled?: boolean
}) {
    const router = useRouter()

    function handleDelete() {
        action(itemId)

        router.replace(refUrl)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    className={cn(className)}
                    variant={variant}
                    disabled={disabled}
                >
                    <Trash className="h-4 w-4 mr-1" />
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Acción definitiva</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro que desea eliminar este elemento? Esta acción no se puede revertir.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete()}>
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
