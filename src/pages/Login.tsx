"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Vegan } from "lucide-react"

export default function Login() {
    // Estados para el proceso de autenticación
    const [authStep, setAuthStep] = useState<"credentials" | "security-question">("credentials")
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        dogName: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { isAuthenticated, login } = useAuth()

    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    // Credenciales estáticas
    const VALID_CREDENTIALS = {
        username: "Admin",
        password: "Titan123",
        dogName: "titan",
    }

    // Manejar el envío del formulario de credenciales
    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (credentials.username === VALID_CREDENTIALS.username && credentials.password === VALID_CREDENTIALS.password) {
            // Si las credenciales son correctas, avanzar al segundo factor
            setAuthStep("security-question")
        } else {
            setError("Usuario o contraseña incorrectos")
        }
    }

    // Manejar el envío de la pregunta de seguridad
    const handleSecurityQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (credentials.dogName.toLowerCase() === VALID_CREDENTIALS.dogName) {
            // Si la respuesta es correcta, autenticar y redirigir al dashboard
            login()
            navigate("/dashboard")
        } else {
            setError("Respuesta incorrecta")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo - Reemplazado con el icono Vegan */}
                <div className="flex justify-center">
                    <Vegan className="h-16 w-16 text-primary" />
                </div>

                {/* Título */}
                <h2 className="mt-6 text-center text-2xl font-bold text-white">
                    {authStep === "credentials" ? "Iniciar sesión en tu cuenta" : "Verificación de seguridad"}
                </h2>

                {/* Paso de autenticación actual */}
                <div className="mt-8">
                    {authStep === "credentials" ? (
                        // Formulario de credenciales
                        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md bg-secondary/50 border border-primary/20 px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Ingresa tu usuario"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full rounded-md bg-secondary/50 border border-primary/20 px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Ingresa tu contraseña"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>

                            {/* Mensaje de error */}
                            {error && <div className="text-sm text-center text-red-400">{error}</div>}

                            {/* Botón de submit */}
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Continuar
                            </button>
                        </form>
                    ) : (
                        // Formulario de pregunta de seguridad
                        <form onSubmit={handleSecurityQuestionSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="dogName" className="block text-sm font-medium text-gray-300">
                                    ¿Cuál es el nombre de tu perro?
                                </label>
                                <input
                                    id="dogName"
                                    name="dogName"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md bg-secondary/50 border border-primary/20 px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Ingresa el nombre de tu perro"
                                    value={credentials.dogName}
                                    onChange={(e) => setCredentials({ ...credentials, dogName: e.target.value })}
                                />
                            </div>

                            {/* Mensaje de error */}
                            {error && <div className="text-sm text-center text-red-400">{error}</div>}

                            {/* Botones */}
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setAuthStep("credentials")}
                                    className="flex-1 py-2 px-4 border border-primary/20 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Volver
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

