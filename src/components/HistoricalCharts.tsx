"use client"

import { useState, useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { Parcela } from "../services/api"

interface HistoricalData {
    _id: {
        year: number
        month: number
        day: number
        hour?: number
    }
    temperatura: number
    humedad: number
    lluvia: number
    sol: number
    timestamp: string
}

interface ChartData {
    name: string
    temperatura: number
    humedad: number
    lluvia: number
    sol: number
}

interface HistoricalChartsProps {
    selectedParcela: Parcela | null
}

const HistoricalCharts = ({ selectedParcela }: HistoricalChartsProps) => {
    const [activeTab, setActiveTab] = useState("temperature")
    const [timeRange, setTimeRange] = useState("24h")
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const chartRef = useRef<HTMLCanvasElement>(null)
    const chartInstance = useRef<Chart | null>(null)

    // Función para formatear los datos para el gráfico
    const formatChartData = (data: HistoricalData[]): ChartData[] => {
        return data.map((item) => {
            const date = new Date(item.timestamp)
            let timeString

            if (timeRange === "24h" || timeRange === "7d") {
                timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            } else {
                timeString = date.toLocaleDateString([], { day: "2-digit", month: "2-digit" })
            }

            return {
                name: timeString,
                temperatura: Number.parseFloat(item.temperatura.toFixed(1)),
                humedad: Number.parseFloat(item.humedad.toFixed(1)),
                lluvia: Number.parseFloat(item.lluvia.toFixed(1)),
                sol: Number.parseFloat(item.sol.toFixed(1)),
            }
        })
    }

    // Cargar datos históricos
    const fetchHistoricalData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Configurar parámetros de la solicitud
            let days = "1"
            let interval = "hour"

            switch (timeRange) {
                case "24h":
                    days = "1"
                    interval = "hour"
                    break
                case "7d":
                    days = "7"
                    interval = "hour"
                    break
                case "30d":
                    days = "30"
                    interval = "day"
                    break
                case "90d":
                    days = "90"
                    interval = "day"
                    break
            }

            // URL base para la solicitud
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

            // Decidir qué endpoint usar según si hay una parcela seleccionada
            let url
            if (selectedParcela) {
                url = `${baseUrl}/history/parcelas/${selectedParcela.id}?days=${days}&interval=${interval}`
            } else {
                url = `${baseUrl}/history/sensors?days=${days}&interval=${interval}`
            }

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`)
            }

            const data = await response.json()
            setChartData(formatChartData(data))
        } catch (err) {
            console.error("Error al cargar datos históricos:", err)
            setError("No se pudieron cargar los datos históricos. Intente de nuevo más tarde.")
        } finally {
            setLoading(false)
        }
    }

    // Efecto para cargar datos cuando cambia la parcela seleccionada o el rango de tiempo
    useEffect(() => {
        fetchHistoricalData()

        // Configurar actualización periódica si es el rango de 24h
        let intervalId: number | null = null
        if (timeRange === "24h") {
            intervalId = window.setInterval(fetchHistoricalData, 5 * 60 * 1000) // 5 minutos
        }

        return () => {
            if (intervalId !== null) {
                clearInterval(intervalId)
            }
        }
    }, [selectedParcela, timeRange])

    // Obtener color según el tipo de dato
    const getLineColor = (dataType: string): string => {
        switch (dataType) {
            case "temperatura":
                return "#FF5733" // Rojo para temperatura
            case "humedad":
                return "#33A1FD" // Azul para humedad
            case "lluvia":
                return "#6675FF" // Azul-morado para lluvia
            case "sol":
                return "#FFCC33" // Amarillo para sol
            default:
                return "#00CED1" // Color principal por defecto
        }
    }

    // Obtener unidad según el tipo de dato
    const getUnit = (dataType: string): string => {
        switch (dataType) {
            case "temperatura":
                return "°C"
            case "humedad":
                return "%"
            case "lluvia":
                return "mm"
            case "sol":
                return "%"
            default:
                return ""
        }
    }

    // Efecto para crear/actualizar el gráfico
    useEffect(() => {
        if (chartRef.current && chartData.length > 0 && !loading) {
            // Destruir el gráfico existente si lo hay
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }

            const dataKey =
                activeTab === "temperature"
                    ? "temperatura"
                    : activeTab === "humidity"
                        ? "humedad"
                        : activeTab === "rainfall"
                            ? "lluvia"
                            : "sol"

            const ctx = chartRef.current.getContext("2d")
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: chartData.map((item) => item.name),
                        datasets: [
                            {
                                label: `${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} (${getUnit(dataKey)})`,
                                data: chartData.map((item) => item[dataKey as keyof typeof item] as number),
                                borderColor: getLineColor(dataKey),
                                backgroundColor: getLineColor(dataKey) + "33",
                                borderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                fill: false,
                                tension: 0.1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: "rgba(255, 255, 255, 0.7)",
                                },
                            },
                            tooltip: {
                                backgroundColor: "rgba(10, 25, 41, 0.9)",
                                borderColor: "#00CED1",
                                titleColor: "white",
                                bodyColor: "white",
                                displayColors: false,
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                    borderColor: "rgba(255, 255, 255, 0.7)",
                                },
                                ticks: {
                                    color: "rgba(255, 255, 255, 0.7)",
                                },
                            },
                            y: {
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                    borderColor: "rgba(255, 255, 255, 0.7)",
                                },
                                ticks: {
                                    color: "rgba(255, 255, 255, 0.7)",
                                },
                            },
                        },
                    },
                })
            }
        }
    }, [chartData, activeTab, loading])

    // Renderizar el contenido del gráfico
    const renderChart = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-[#00CED1]">Cargando datos...</div>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-[#FF5733]">{error}</div>
                </div>
            )
        }

        if (chartData.length === 0) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-[#8899ac]">No hay datos disponibles</div>
                </div>
            )
        }

        return (
            <div className="h-[350px]">
                <canvas ref={chartRef} />
            </div>
        )
    }

    return (
        <div className="bg-[hsl(210,100%,11%)] shadow-md h-full rounded-lg border border-border">
            <div className="p-4 flex flex-row items-center justify-between border-b border-border/30">
                <h2 className="text-lg font-semibold text-white">
                    {selectedParcela ? `Datos históricos: ${selectedParcela.nombre}` : "Datos históricos generales"}
                </h2>
                <div className="relative">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="w-32 bg-[hsl(217,33%,17%)] border border-border/30 rounded-md px-3 py-1 text-white appearance-none"
                    >
                        <option value="24h">Últimas 24h</option>
                        <option value="7d">Últimos 7 días</option>
                        <option value="30d">Últimos 30 días</option>
                        <option value="90d">Últimos 90 días</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className="h-4 w-4 text-[#00CED1]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="mb-4">
                    <div className="grid grid-cols-4 gap-1 bg-[hsl(217,33%,17%)] rounded-md overflow-hidden">
                        <button
                            className={`py-2 px-4 text-sm ${activeTab === "temperature" ? "bg-[#00CED1] text-[hsl(210,100%,11%)]" : "hover:bg-[hsl(215,20%,65%)]/20"}`}
                            onClick={() => setActiveTab("temperature")}
                        >
                            Temperatura
                        </button>
                        <button
                            className={`py-2 px-4 text-sm ${activeTab === "humidity" ? "bg-[#00CED1] text-[hsl(210,100%,11%)]" : "hover:bg-[hsl(215,20%,65%)]/20"}`}
                            onClick={() => setActiveTab("humidity")}
                        >
                            Humedad
                        </button>
                        <button
                            className={`py-2 px-4 text-sm ${activeTab === "rainfall" ? "bg-[#00CED1] text-[hsl(210,100%,11%)]" : "hover:bg-[hsl(215,20%,65%)]/20"}`}
                            onClick={() => setActiveTab("rainfall")}
                        >
                            Lluvia
                        </button>
                        <button
                            className={`py-2 px-4 text-sm ${activeTab === "sunlight" ? "bg-[#00CED1] text-[hsl(210,100%,11%)]" : "hover:bg-[hsl(215,20%,65%)]/20"}`}
                            onClick={() => setActiveTab("sunlight")}
                        >
                            Sol
                        </button>
                    </div>
                </div>
                <div className="mt-2">{renderChart()}</div>
            </div>
        </div>
    )
}

export default HistoricalCharts

