"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchIotData, type ApiResponse, type Sensor, type Parcela } from "../services/api"

interface IotDataContextType {
    loading: boolean
    error: string | null
    sensores: Sensor | null
    parcelas: Parcela[]
    refetchData: () => Promise<void>
}

const IotDataContext = createContext<IotDataContextType | undefined>(undefined)

export const useIotData = () => {
    const context = useContext(IotDataContext)
    if (context === undefined) {
        throw new Error("useIotData debe ser usado dentro de un IotDataProvider")
    }
    return context
}

interface IotDataProviderProps {
    children: ReactNode
}

export const IotDataProvider = ({ children }: IotDataProviderProps) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<ApiResponse | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const apiData = await fetchIotData()
            setData(apiData)
        } catch (err) {
            setError("Error al cargar los datos. Por favor, intenta de nuevo.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

        // Opcional: Configurar un intervalo para actualizar los datos cada cierto tiempo
        const intervalId = setInterval(fetchData, 60000) // Actualizar cada minuto

        return () => clearInterval(intervalId)
    }, [])

    return (
        <IotDataContext.Provider
            value={{
                loading,
                error,
                sensores: data?.sensores || null,
                parcelas: data?.parcelas || [],
                refetchData: fetchData,
            }}
        >
            {children}
        </IotDataContext.Provider>
    )
}

