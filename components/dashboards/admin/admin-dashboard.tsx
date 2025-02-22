"use server"

import { DataTable } from "@/components/ui/data-table";
import { StoreVisitsColumns, StoreVisit } from "./store-visits-columns";
import { KeywordSearchColumns, KeywordSearch } from "./keyword-search-columns";
import { getAllStoreVisits } from "@/actions/store-visits";
import { getKeywordSearches } from "@/actions/keyword-searches";


export interface FilterInputProps {
    name: string;
    namePlural: string;
    type?: string;
}

async function getStoreVisitsData() {
    const dbStoreVisits = await getAllStoreVisits();
    const storeVisits: StoreVisit[] = dbStoreVisits.map((storeVisit) => {
        return {
            id: storeVisit.id,
            storeId: storeVisit.storeId,
            store: storeVisit.store,
            ipAddress: storeVisit.ipAddress,
            createdAt: storeVisit.createdAt,
        };
    });
    return storeVisits;
}

async function getKeywordSearchesData() {
    const dbKeywords = await getKeywordSearches()
    const keywordSearches: KeywordSearch[] = dbKeywords.map((kw) => ({
        id: kw.id,
        keyword: kw.keyword,
        ipAddress: kw.ipAddress,
        createdAt: kw.createdAt,
    }));
    return keywordSearches;
}

export default async function AdminDashboard() {
    const storeVisits = await getStoreVisitsData();
    const keywordSearches = await getKeywordSearchesData();

    const filterInputsVisits: FilterInputProps[] = [
        { name: "storeName", namePlural: "tiendas" },
        { name: "ipAddress", namePlural: "direcciones IP" },
        { name: "createdAt", namePlural: "fechas", type: "date" },
    ];

    const filterInputsKeywords: FilterInputProps[] = [
        { name: "keyword", namePlural: "palabras clave" },
        { name: "ipAddress", namePlural: "direcciones IP" },
        { name: "createdAt", namePlural: "fechas", type: "date" },
    ];

    return (
        <div className="container mx-auto py-10 space-y-10">            
            {/* Tabla de búsquedas de palabras clave */}
            <div>
                <p className="text-xl font-bold mb-8">Búsquedas de palabras clave</p>
                <DataTable
                    columns={KeywordSearchColumns}
                    data={keywordSearches}
                    noResultText="No se encontraron búsquedas"
                    filterInputs={filterInputsKeywords}
                    totals={true}
                />
            </div>

            {/* Tabla de visitas a tiendas */}
            <div>
                <p className="text-xl font-bold mb-8">Visitas a tiendas</p>
                <DataTable
                    columns={StoreVisitsColumns}
                    data={storeVisits}
                    noResultText="No se encontraron visitas"
                    filterInputs={filterInputsVisits}
                    totals={true}
                />
            </div>
        </div>
    );
}
