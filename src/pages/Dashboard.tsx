"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MapComponent from "../components/MapComponent"
import WeatherPanels from "../components/WeatherPanels"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { fetchIotData, type Parcela } from "../services/api"

export default function Dashboard() {
    // Estado para los datos del clima (datos generales)
    const [weatherData, setWeatherData] = useState({
        temperature: 28,
        humidity: 65,
        rainfall: 12,
        sunIntensity: 85,
        parcelaName: "General", // Agregamos esta propiedad
    })

    // Estado para las parcelas (solo para el mapa)
    const [parcelas, setParcelas] = useState<Parcela[]>([])
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { logout } = useAuth()

    // Efecto para cargar los datos de la API
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchIotData()

                // Actualizar los datos del clima con los sensores generales
                setWeatherData({
                    temperature: data.sensores.temperatura,
                    humidity: data.sensores.humedad,
                    rainfall: data.sensores.lluvia,
                    sunIntensity: data.sensores.sol,
                    parcelaName: "General", // Agregamos esta propiedad
                })

                // Actualizar las parcelas para el mapa
                setParcelas(data.parcelas)

                console.log("Datos cargados correctamente:", data)
            } catch (error) {
                console.error("Error cargando datos:", error)
            }
        }

        loadData()

        // Actualizar datos cada 5 minutos
        const interval = setInterval(loadData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-secondary text-white">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={logout} />

            <div className="flex flex-1 overflow-hidden">
                {sidebarOpen && <Sidebar />}

                <main className="flex-1 p-4 md:p-6 overflow-hidden transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
                        <div className="lg:col-span-2 h-full">
                            <MapComponent sidebarOpen={sidebarOpen} parcelas={parcelas} />
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

