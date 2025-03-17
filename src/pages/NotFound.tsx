"use client"

import { useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-white">
            <div className="w-full max-w-md text-center space-y-6">

                <div className="flex justify-center">
                    <div className="relative">
                        <AlertTriangle className="h-24 w-24 text-primary/80" />
                        <div className="absolute inset-0 animate-ping opacity-30">
                            <AlertTriangle className="h-24 w-24 text-primary" />
                        </div>
                    </div>
                </div>


                <div className="space-y-3">
                    <h1 className="text-5xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-semibold">Página no encontrada</h2>
                    <p className="text-gray-400 mt-2">
                        Aun en desarrollo
                    </p>
                </div>

                {/* Botón para volver */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-8 inline-flex items-center px-4 py-2 border border-primary/30 rounded-md shadow-sm text-sm font-medium text-white bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                </button>
            </div>
        </div>
    )
}

