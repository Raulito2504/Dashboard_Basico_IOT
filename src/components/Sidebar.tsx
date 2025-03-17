"use client"

import { CalendarDays, FolderClosed, Home, LineChart, Users2, Vegan } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
    const navigate = useNavigate()

    // Función para manejar los clics en los botones del sidebar
    const handleNavigation = (path: string) => {
        // Si es el botón de Dashboard, navegar al dashboard
        if (path === "/dashboard") {
            navigate(path)
        } else {
            // Para cualquier otro botón, navegar a la página 404
            navigate("/404")
        }
    }

    return (
        <div className="w-64 bg-secondary border-r border-primary/20 h-[calc(100vh-8rem)] transition-all duration-300 ease-in-out">
            <div className="p-4">
                {/* Logo - Reemplazado con el icono Vegan */}
                <div className="flex items-center justify-center mb-6">
                    <Vegan className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-2">
                    <button
                        className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md bg-primary/10 text-white hover:bg-primary/20 transition-colors"
                        onClick={() => handleNavigation("/dashboard")}
                    >
                        <Home className="mr-2 h-4 w-4 text-primary" />
                        Casa
                        <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded text-primary">5</span>
                    </button>

                    <button
                        className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                        onClick={() => handleNavigation("/team")}
                    >
                        <Users2 className="mr-2 h-4 w-4 text-primary" />
                        Equipo
                    </button>

                    <button
                        className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                        onClick={() => handleNavigation("/projects")}
                    >
                        <FolderClosed className="mr-2 h-4 w-4 text-primary" />
                        Proyectos
                        <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded text-primary">12</span>
                    </button>

                    <button
                        className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                        onClick={() => handleNavigation("/calendar")}
                    >
                        <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                        Calendario
                        <span className="ml-auto text-xs bg-primary/20 px-2 py-0.5 rounded text-primary">20+</span>
                    </button>

                    <button
                        className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                        onClick={() => handleNavigation("/stats")}
                    >
                        <LineChart className="mr-2 h-4 w-4 text-primary" />
                        Estadísticas
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="px-3 text-sm font-semibold text-primary/80 mb-2">Mis equipos</h2>

                    <div className="space-y-2">
                        <button
                            className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                            onClick={() => handleNavigation("/teams/totem")}
                        >
                            <div className="mr-2 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                                T
                            </div>
                            Totem
                        </button>

                        <button
                            className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                            onClick={() => handleNavigation("/teams/heretics")}
                        >
                            <div className="mr-2 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                                H
                            </div>
                            Heretics
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-64 border-t border-primary/20 p-4">
                <button
                    className="w-full flex items-center justify-start px-3 py-2 text-sm rounded-md text-white hover:bg-primary/10 transition-colors"
                    onClick={() => handleNavigation("/profile")}
                >
                    <div className="mr-2 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                        EC
                    </div>
                    Eusebio Calixto
                </button>
            </div>
        </div>
    )
}

