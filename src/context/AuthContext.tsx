"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir el tipo para el contexto
type AuthContextType = {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    // Verificar si hay una sesión guardada al cargar la aplicación
    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated")
        if (authStatus === "true") {
            setIsAuthenticated(true)
        }
    }, [])

    // Función para iniciar sesión
    const login = () => {
        localStorage.setItem("isAuthenticated", "true")
        setIsAuthenticated(true)
    }

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem("isAuthenticated")
        setIsAuthenticated(false)
    }

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}

