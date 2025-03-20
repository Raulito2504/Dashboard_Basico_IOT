import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { fetchHistoricalData, type HistoricalDataPoint } from "../services/historicalDataService";
import { Parcela } from "../services/api";

interface ChartShowcaseProps {
    selectedParcela: Parcela | null;
}

const ChartShowcase = ({ selectedParcela }: ChartShowcaseProps) => {
    const [timeRange, setTimeRange] = useState("7d");
    const [data, setData] = useState<HistoricalDataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lineChartRef = useRef<HTMLCanvasElement>(null);
    const barChartRef = useRef<HTMLCanvasElement>(null);
    const radarChartRef = useRef<HTMLCanvasElement>(null);

    const lineChartInstance = useRef<Chart | null>(null);
    const barChartInstance = useRef<Chart | null>(null);
    const radarChartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Configurar parámetros según el rango de tiempo seleccionado
                let days = "7";
                let interval = "hour";

                switch (timeRange) {
                    case "24h":
                        days = "1";
                        interval = "hour";
                        break;
                    case "7d":
                        days = "7";
                        interval = "hour";
                        break;
                    case "30d":
                        days = "30";
                        interval = "day";
                        break;
                }

                const historicalData = await fetchHistoricalData(
                    selectedParcela?.id,
                    parseInt(days),
                    interval
                );

                setData(historicalData);
            } catch (err) {
                console.error("Error loading historical data:", err);
                setError("No se pudieron cargar los datos históricos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedParcela, timeRange]);

    useEffect(() => {
        if (data.length > 0 && !loading) {
            renderCharts();
        }
    }, [data, loading]);

    const renderCharts = () => {
        renderLineChart();
        renderBarChart();
        renderRadarChart();
    };

    const formatDate = (timestamp: string): string => {
        const date = new Date(timestamp);
        if (timeRange === "24h") {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === "7d") {
            return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
        } else {
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }
    };

    const renderLineChart = () => {
        if (lineChartRef.current) {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }

            const ctx = lineChartRef.current.getContext('2d');
            if (ctx) {
                lineChartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(point => formatDate(point.timestamp)),
                        datasets: [
                            {
                                label: 'Temperatura (°C)',
                                data: data.map(point => point.temperatura),
                                borderColor: '#FF5733',
                                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                                borderWidth: 2,
                                tension: 0.1,
                            },
                            {
                                label: 'Humedad (%)',
                                data: data.map(point => point.humedad),
                                borderColor: '#33A1FD',
                                backgroundColor: 'rgba(51, 161, 253, 0.2)',
                                borderWidth: 2,
                                tension: 0.1,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Temperatura y Humedad',
                                color: 'rgba(255, 255, 255, 0.8)'
                            },
                            legend: {
                                labels: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        }
                    }
                });
            }
        }
    };

    const renderBarChart = () => {
        if (barChartRef.current) {
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }

            const ctx = barChartRef.current.getContext('2d');
            if (ctx) {
                barChartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map(point => formatDate(point.timestamp)),
                        datasets: [
                            {
                                label: 'Lluvia (mm)',
                                data: data.map(point => point.lluvia),
                                backgroundColor: 'rgba(102, 117, 255, 0.6)',
                                borderColor: 'rgba(102, 117, 255, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Nivel de Lluvia',
                                color: 'rgba(255, 255, 255, 0.8)'
                            },
                            legend: {
                                labels: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    maxRotation: 45,
                                    minRotation: 45
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        }
                    }
                });
            }
        }
    };

    const renderRadarChart = () => {
        if (radarChartRef.current) {
            if (radarChartInstance.current) {
                radarChartInstance.current.destroy();
            }

            // Para el radar chart, vamos a usar los últimos 5 puntos de datos
            const recentData = data.slice(-5);

            const ctx = radarChartRef.current.getContext('2d');
            if (ctx) {
                radarChartInstance.current = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Temperatura', 'Humedad', 'Lluvia', 'Sol'],
                        datasets: recentData.map((point, index) => ({
                            label: formatDate(point.timestamp),
                            data: [point.temperatura, point.humedad, point.lluvia, point.sol],
                            backgroundColor: `rgba(0, 206, 209, ${0.1 + index * 0.15})`,
                            borderColor: `rgba(0, 206, 209, ${0.7 + index * 0.05})`,
                            borderWidth: 1
                        }))
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Comparación de Factores',
                                color: 'rgba(255, 255, 255, 0.8)'
                            },
                            legend: {
                                labels: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        },
                        scales: {
                            r: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                pointLabels: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                },
                                angleLines: {
                                    color: 'rgba(255, 255, 255, 0.2)'
                                }
                            }
                        }
                    }
                });
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando datos...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-destructive">{error}</div>;
    }

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos disponibles</div>;
    }

    return (
        <div className="bg-card rounded-lg border border-border p-4 h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    {selectedParcela ? `Visualización de ${selectedParcela.nombre}` : 'Visualización general'}
                </h2>
                <div className="relative">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-muted border border-border/30 rounded-md px-3 py-1 text-white appearance-none"
                    >
                        <option value="24h">Últimas 24h</option>
                        <option value="7d">Últimos 7 días</option>
                        <option value="30d">Últimos 30 días</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                    <div className="h-[200px]">
                        <canvas ref={lineChartRef} />
                    </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                    <div className="h-[200px]">
                        <canvas ref={barChartRef} />
                    </div>
                </div>
                <div className="bg-muted rounded-lg p-4 md:col-span-2">
                    <div className="h-[300px]">
                        <canvas ref={radarChartRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartShowcase;