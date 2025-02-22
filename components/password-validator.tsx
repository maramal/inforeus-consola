"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PasswordValidatorProps = {
    password: string
}

type RuleProp = {
    text: string
    regex: RegExp
}

const rules: RuleProp[] = [
    {
        text: "Debe tener al menos 8 caracteres.",
        regex: /.{8,}/,
    },
    {
        text: "Debe tener al menos un número",
        regex: /[0-9]/
    },
    {
        text: "Debe tener al menos una letra mayúscula.",
        regex: /[A-Z]/,
    },
    {
        text: "Debe tener al menos un símbolo.",
        regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
]

// Función auxiliar que valida si la contraseña cumple todas las reglas
export function validatePassword(password: string): boolean {
    const trimmed = (password || "").trim();
    return rules.every(rule => rule.regex.test(trimmed));
}

export default function PasswordValidator({ password }: PasswordValidatorProps) {
    // Usamos (password || "") para asegurarnos de que nunca sea undefined
    const validRules = useMemo(
        () => rules.map(rule => rule.regex.test((password || "").trim())),
        [password]
    );

    return (
        <Card className="w-[300px] max-w-lg">
            <CardHeader>
                <CardTitle className="text-md font-bold">
                    La contraseña debe cumplir con los siguientes requisitos:
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc text-sm space-y-3">
                    {rules.map((rule, i) => (
                        <li
                            key={i}
                            className={validRules[i] ? "text-green-500" : "text-red-500"}
                        >
                            {rule.text}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
