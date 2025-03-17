"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MapComponent from "../components/MapComponent"
import WeatherPanels from "../components/WeatherPanels"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { fetchIotData, fetchIotDataWithFetch, type ApiResponse, type Parcela, type Sensor } from "../services/api"

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [apiData, setApiData] = useState<ApiResponse | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null)
    const { logout } = useAuth()

    // Datos de respaldo en caso de que la API falle
    const fallbackData = {
        sensores: {
            humedad: 63.7,
            temperatura: 22,
            lluvia: 2.5,
            sol: 60,
        },
        parcelas: [
            {
                id: 1,
                nombre: "Parcela 1",
                ubicacion: "Zona Norte",
                responsable: "Juan Pérez",
                tipo_cultivo: "Tomate",
                ultimo_riego: "2025-03-17 14:44:29",
                sensor: {
                    humedad: 35.5,
                    temperatura: 18.5,
                    lluvia: 6.3,
                    sol: 70,
                },
                latitud: 21.055722864565006,
                longitud: -86.86942155001661,
            },
            {
                id: 2,
                nombre: "Parcela 2",
                ubicacion: "Zona Sur",
                responsable: "Ana Martínez",
                tipo_cultivo: "Maíz",
                ultimo_riego: "2025-03-17 14:44:29",
                sensor: {
                    humedad: 80.5,
                    temperatura: 15,
                    lluvia: 4,
                    sol: 25,
                },
                latitud: 21.065014162508156,
                longitud: -86.88796097929945,
            },
            {
                id: 3,
                nombre: "Parcela 3",
                ubicacion: "Zona Este",
                responsable: "Carlos Gómez",
                tipo_cultivo: "Papa",
                ultimo_riego: "2025-03-17 14:44:29",
                sensor: {
                    humedad: 70,
                    temperatura: 18.5,
                    lluvia: 1.2,
                    sol: 60,
                },
                latitud: 21.069979963109926,
                longitud: -86.88100869331838,
            },
            {
                id: 4,
                nombre: "Parcela 4",
                ubicacion: "Zona Oeste",
                responsable: "María López",
                tipo_cultivo: "Arroz",
                ultimo_riego: "2025-03-17 14:44:29",
                sensor: {
                    humedad: 80.5,
                    temperatura: 18.5,
                    lluvia: 4,
                    sol: 70,
                },
                latitud: 21.067497083532892,
                longitud: -86.8715673172947,
            },
        ],
    }

    // Función para cargar los datos de la API con múltiples intentos
    const loadData = async () => {
        try {
            setLoading(true)

            console.log("Intentando cargar datos...")

            try {
                // Primer intento con Axios
                const data = await fetchIotData()
                console.log("Datos cargados con Axios:", data)

                // Verificar que los datos tengan la estructura esperada
                if (data && data.sensores && data.parcelas) {
                    setApiData(data)
                    setLoading(false)
                    return
                } else {
                    console.error("Datos recibidos con formato incorrecto:", data)
                    throw new Error("Formato de datos incorrecto")
                }
            } catch (axiosError) {
                console.error("Error con Axios, intentando con fetch:", axiosError)

                try {
                    // Segundo intento con fetch nativo
                    const fetchData = await fetchIotDataWithFetch()
                    console.log("Datos cargados con fetch:", fetchData)

                    // Verificar que los datos tengan la estructura esperada
                    if (fetchData && fetchData.sensores && fetchData.parcelas) {
                        setApiData(fetchData)
                        setLoading(false)
                        return
                    } else {
                        console.error("Datos recibidos con formato incorrecto (fetch):", fetchData)
                        throw new Error("Formato de datos incorrecto")
                    }
                } catch (fetchError) {
                    console.error("Error con fetch, usando datos de respaldo:", fetchError)
                    throw fetchError
                }
            }
        } catch (err) {
            console.error("Error final al cargar datos:", err)

            // Usar datos de respaldo en caso de error
            console.log("Usando datos de respaldo")
            if (fallbackData && fallbackData.sensores && fallbackData.parcelas) {
                setApiData(fallbackData)
            }
        } finally {
            setLoading(false)
        }
    }

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData()

        // Opcional: Configurar un intervalo para actualizar los datos cada cierto tiempo
        const intervalId = setInterval(loadData, 60000) // Actualizar cada minuto

        return () => clearInterval(intervalId)
    }, [])

    // Manejar la selección de una parcela
    const handleParcelaSelect = (parcela: Parcela) => {
        console.log("Parcela seleccionada:", parcela)
        setSelectedParcela(parcela)
    }

    // Determinar qué datos de sensores mostrar
    const getSensorData = (): Sensor => {
        // Si hay una parcela seleccionada, mostrar sus datos específicos
        if (selectedParcela) {
            return selectedParcela.sensor
        }

        // Si no hay parcela seleccionada, mostrar los datos generales
        return (
            apiData?.sensores || {
                temperatura: 0,
                humedad: 0,
                lluvia: 0,
                sol: 0,
            }
        )
    }

    // Preparar los datos para el componente WeatherPanels
    const weatherData = {
        temperature: getSensorData().temperatura,
        humidity: getSensorData().humedad,
        rainfall: getSensorData().lluvia,
        sunIntensity: getSensorData().sol,
        parcelaName: selectedParcela ? selectedParcela.nombre : null,
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary text-white">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={logout} />

            <div className="flex flex-1 overflow-hidden">
                {sidebarOpen && <Sidebar />}

                <main className="flex-1 p-4 md:p-6 overflow-hidden transition-all duration-300">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 z-50">
                            <div className="text-primary text-lg">Cargando datos...</div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
                        <div className="lg:col-span-2 h-full">
                            <MapComponent
                                sidebarOpen={sidebarOpen}
                                parcelas={apiData?.parcelas || []}
                                onParcelaSelect={handleParcelaSelect}
                                selectedParcelaId={selectedParcela?.id}
                            />
                        </div>

                        <div className="lg:col-span-1 h-full">
                            <WeatherPanels data={weatherData} />
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}

