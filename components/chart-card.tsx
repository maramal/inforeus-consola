"use client"

import { BarChart } from "recharts"
import type { Bar } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import React from "react"

interface ChartCardProps {
    title: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chartData: any[]
    chartConfig: ChartConfig
    bars: Bar[]
}

export default function ChartCard({
    title,
    chartData,
    chartConfig,
    bars
}: ChartCardProps) {
    return (
        <Card className="w-[400px]">
            <CardHeader className="text-center font-bold text-2xl">
                {title}
            </CardHeader>
            <CardContent className="flex flex-1 justify-center align-middle">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        {...bars}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}