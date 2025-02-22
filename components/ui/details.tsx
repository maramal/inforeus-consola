import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

export type DataProp = {
    name: string
    value: string
}

interface DetailsProps {
    data: DataProp[]
}

export default function Details({
    data
}: DetailsProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableBody>
                    {data.map((d, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-bold">{d.name}</TableCell>
                            <TableCell>{d.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}