import axios from "axios"


export interface Sensor {
    humedad: number
    temperatura: number
    lluvia: number
    sol: number
}

export interface Parcela {
    id: number
    nombre: string
    ubicacion: string
    responsable: string
    tipo_cultivo: string
    ultimo_riego: string
    sensor: Sensor
    latitud: number
    longitud: number
}

export interface ApiResponse {
    sensores: Sensor
    parcelas: Parcela[]
}


const api = axios.create({
    baseURL: "https://moriahmkt.com",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})


export const fetchIotData = async (): Promise<ApiResponse> => {
    try {
        console.log("Iniciando petición a la API...")
        const response = await api.get<ApiResponse>("/iotapp/")
        console.log("Respuesta recibida:", response.data)


        if (!response.data || !response.data.sensores || !response.data.parcelas) {
            console.error("Respuesta con formato incorrecto:", response.data)
            throw new Error("Formato de respuesta incorrecto")
        }

        return response.data
    } catch (error) {
        console.error("Error detallado al obtener datos de la API:", error)


        if (axios.isAxiosError(error)) {
            console.error("Detalles de la respuesta:", error.response?.data)
            console.error("Estado HTTP:", error.response?.status)
            console.error("Cabeceras:", error.response?.headers)

            if (error.response?.status === 0) {
                console.error("Posible error de CORS o la API no está disponible")
            }
        }

        throw error
    }
}


export const fetchIotDataWithFetch = async (): Promise<ApiResponse> => {
    try {
        console.log("Iniciando petición con fetch...")
        const response = await fetch("https://moriahmkt.com/iotapp/")

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("Respuesta recibida con fetch:", data)


        if (!data || !data.sensores || !data.parcelas) {
            console.error("Respuesta con formato incorrecto (fetch):", data)
            throw new Error("Formato de respuesta incorrecto")
        }

        return data as ApiResponse
    } catch (error) {
        console.error("Error al obtener datos con fetch:", error)
        throw error
    }
}

export default api

