"use client"

import type React from "react"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, BarChart, Globe, Settings, Users, Droplets, Thermometer, Sun } from "lucide-react"

const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    // Función para manejar los clics en los enlaces
    const handleNavigation = (e: React.MouseEvent, path: string) => {
        e.preventDefault() // Prevenir la navegación por defecto del Link

        // Si es el botón de Dashboard o Analysis, navegar a esa ruta
        if (path === "/dashboard" || path === "/analysis") {
            navigate(path)
        } else {
            // Para cualquier otro botón, navegar a la página 404
            navigate("/404")
        }
    }

    return (
        <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold text-primary">AgroIoT</h1>
                <p className="text-xs text-muted-foreground">Sistema de monitoreo de cultivos</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-2 rounded-md ${isActive("/dashboard") ? "bg-primary text-background" : "hover:bg-muted"}`}
                    onClick={(e) => handleNavigation(e, "/dashboard")}
                >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                </Link>
                <Link
                    to="/analysis"
                    className={`flex items-center px-4 py-2 rounded-md ${isActive("/analysis") ? "bg-primary text-background" : "hover:bg-muted"}`}
                    onClick={(e) => handleNavigation(e, "/analysis")}
                >
                    <BarChart className="mr-3 h-5 w-5" />
                    Análisis
                </Link>

                <div className="pt-4 pb-2">
                    <div className="px-4 text-xs font-semibold text-muted-foreground">SENSORES</div>
                </div>

                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Thermometer className="mr-3 h-5 w-5 text-[#FF5733]" />
                    Temperatura
                </div>
                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Droplets className="mr-3 h-5 w-5 text-[#33A1FD]" />
                    Humedad
                </div>
                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Sun className="mr-3 h-5 w-5 text-[#FFCC33]" />
                    Luz Solar
                </div>

                <div className="pt-4 pb-2">
                    <div className="px-4 text-xs font-semibold text-muted-foreground">GESTIÓN</div>
                </div>

                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Globe className="mr-3 h-5 w-5" />
                    Parcelas
                </div>
                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Users className="mr-3 h-5 w-5" />
                    Usuarios
                </div>
                <div
                    className="flex items-center px-4 py-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate("/404")}
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Configuración
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Última actualización:</p>
                    <p className="text-sm">{new Date().toLocaleString()}</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar

