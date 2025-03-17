import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react"
import WeatherPanel from "./WeatherPanel"

interface WeatherData {
    temperature: number
    humidity: number
    rainfall: number
    sunIntensity: number
    parcelaName: string | null
}

interface WeatherPanelsProps {
    data: WeatherData
}

const WeatherPanels = ({ data }: WeatherPanelsProps) => {
    return (
        <div className="flex flex-col h-full">
            {data.parcelaName && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <h3 className="text-primary font-medium text-center">Datos de: {data.parcelaName}</h3>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 flex-1">
                <WeatherPanel
                    title="Temperatura"
                    value={`${data.temperature.toFixed(1)}°C`}
                    icon={<Thermometer className="h-8 w-8 text-red-400" />}
                    color="from-orange-500 to-red-500"
                />

                <WeatherPanel
                    title="Humedad"
                    value={`${data.humidity.toFixed(1)}%`}
                    icon={<Droplets className="h-8 w-8 text-blue-400" />}
                    color="from-blue-400 to-cyan-500"
                />

                <WeatherPanel
                    title="Lluvia"
                    value={`${data.rainfall.toFixed(1)} mm`}
                    icon={<CloudRain className="h-8 w-8 text-blue-300" />}
                    color="from-blue-500 to-indigo-600"
                />

                <WeatherPanel
                    title="Intensidad del Sol"
                    value={`${data.sunIntensity.toFixed(0)}%`}
                    icon={<Sun className="h-8 w-8 text-yellow-400" />}
                    color="from-yellow-400 to-orange-500"
                />
            </div>
        </div>
    )
}

export default WeatherPanels

