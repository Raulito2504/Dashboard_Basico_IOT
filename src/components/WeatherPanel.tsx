import type { ReactNode } from "react"

interface WeatherPanelProps {
    title: string
    value: string
    icon: ReactNode
    color: string
}

const WeatherPanel = ({ title, value, icon, color }: WeatherPanelProps) => {
    return (
        <div className="bg-panel-bg rounded-xl border border-primary/30 p-4 flex flex-col items-center justify-center hover:shadow-neon transition-shadow duration-300">
            <div className="mb-2">{icon}</div>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
            <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
        </div>
    )
}

export default WeatherPanel

