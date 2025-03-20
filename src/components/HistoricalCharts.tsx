// src/components/HistoricalCharts.tsx
import { useState, useEffect } from "react";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import {
        LineChart,
        Line,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        Legend,
        ResponsiveContainer
    } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Parcela } from "../services/api";

interface HistoricalData {
    _id: {
        year: number;
        month: number;
        day: number;
        hour?: number;
    };
    temperatura: number;
    humedad: number;
    lluvia: number;
    sol: number;
    timestamp: string;
}

interface ChartData {
    name: string;
    temperatura: number;
    humedad: number;
    lluvia: number;
    sol: number;
}

interface HistoricalChartsProps {
    selectedParcela: Parcela | null;
}

const HistoricalCharts = ({ selectedParcela }: HistoricalChartsProps) => {
    const [activeTab, setActiveTab] = useState("temperature");
    const [timeRange, setTimeRange] = useState("24h");
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Función para formatear los datos para el gráfico
    const formatChartData = (data: HistoricalData[]): ChartData[] => {
        return data.map(item => {
            const date = new Date(item.timestamp);
            let timeString;

            if (timeRange === "24h" || timeRange === "7d") {
                timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                timeString = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
            }

            return {
                name: timeString,
                temperatura: parseFloat(item.temperatura.toFixed(1)),
                humedad: parseFloat(item.humedad.toFixed(1)),
                lluvia: parseFloat(item.lluvia.toFixed(1)),
                sol: parseFloat(item.sol.toFixed(1))
            };
        });
    };

    // Cargar datos históricos
    const fetchHistoricalData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Configurar parámetros de la solicitud
            let days = "1";
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
                case "90d":
                    days = "90";
                    interval = "day";
                    break;
            }

            // URL base para la solicitud
            const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

            // Decidir qué endpoint usar según si hay una parcela seleccionada
            let url;
            if (selectedParcela) {
                url = `${baseUrl}/history/parcelas/${selectedParcela.id}?days=${days}&interval=${interval}`;
            } else {
                url = `${baseUrl}/history/sensors?days=${days}&interval=${interval}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setChartData(formatChartData(data));

        } catch (err) {
            console.error("Error al cargar datos históricos:", err);
            setError("No se pudieron cargar los datos históricos. Intente de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos cuando cambia la parcela seleccionada o el rango de tiempo
    useEffect(() => {
        fetchHistoricalData();

        // Configurar actualización periódica si es el rango de 24h
        let intervalId: number | null = null;
        if (timeRange === "24h") {
            intervalId = window.setInterval(fetchHistoricalData, 5 * 60 * 1000); // 5 minutos
        }

        return () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
        };
    }, [selectedParcela, timeRange]);

    // Obtener color según el tipo de dato
    const getLineColor = (dataType: string): string => {
        switch (dataType) {
            case "temperatura":
                return "#FF5733"; // Rojo para temperatura
            case "humedad":
                return "#33A1FD"; // Azul para humedad
            case "lluvia":
                return "#6675FF"; // Azul-morado para lluvia
            case "sol":
                return "#FFCC33"; // Amarillo para sol
            default:
                return "#00CED1"; // Color principal por defecto
        }
    };

    // Obtener unidad según el tipo de dato
    const getUnit = (dataType: string): string => {
        switch (dataType) {
            case "temperatura":
                return "°C";
            case "humedad":
                return "%";
            case "lluvia":
                return "mm";
            case "sol":
                return "%";
            default:
                return "";
        }
    };

    // Renderizar el gráfico adecuado según la pestaña activa
    const renderChart = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-primary">Cargando datos...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-destructive">{error}</div>
                </div>
            );
        }

        if (chartData.length === 0) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">No hay datos disponibles</div>
                </div>
            );
        }

        const dataKey = activeTab === "temperature" ? "temperatura" :
            activeTab === "humidity" ? "humedad" :
                activeTab === "rainfall" ? "lluvia" : "sol";

        return (
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                        dataKey="name"
                        stroke="rgba(255, 255, 255, 0.7)"
                        tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
                    />
                    <YAxis
                        stroke="rgba(255, 255, 255, 0.7)"
                        tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
                        unit={getUnit(dataKey)}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(10, 25, 41, 0.9)",
                            borderColor: "rgb(0, 206, 209)",
                            color: "white"
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={getLineColor(dataKey)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Card className="bg-card shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">
                    {selectedParcela ? `Datos históricos: ${selectedParcela.nombre}` : "Datos históricos generales"}
                </CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32 bg-muted border-primary/30">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Últimas 24h</SelectItem>
                        <SelectItem value="7d">Últimos 7 días</SelectItem>
                        <SelectItem value="30d">Últimos 30 días</SelectItem>
                        <SelectItem value="90d">Últimos 90 días</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="temperature" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4 bg-muted">
                        <TabsTrigger value="temperature">Temperatura</TabsTrigger>
                        <TabsTrigger value="humidity">Humedad</TabsTrigger>
                        <TabsTrigger value="rainfall">Lluvia</TabsTrigger>
                        <TabsTrigger value="sunlight">Sol</TabsTrigger>
                    </TabsList>
                    <TabsContent value="temperature" className="mt-2">
                        {renderChart()}
                    </TabsContent>
                    <TabsContent value="humidity" className="mt-2">
                        {renderChart()}
                    </TabsContent>
                    <TabsContent value="rainfall" className="mt-2">
                        {renderChart()}
                    </TabsContent>
                    <TabsContent value="sunlight" className="mt-2">
                        {renderChart()}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default HistoricalCharts;