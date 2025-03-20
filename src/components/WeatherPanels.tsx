import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react"
import WeatherPanel from "./WeatherPanel"

// Actualizar la interfaz para que parcelaName sea opcional
interface WeatherData {
    temperature: number
    humidity: number
    rainfall: number
    sunIntensity: number
    parcelaName?: string // Hacemos esta propiedad opcional
}

interface WeatherPanelsProps {
    data: WeatherData
}

const WeatherPanels = ({ data }: WeatherPanelsProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
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
    )
}

export default WeatherPanels

