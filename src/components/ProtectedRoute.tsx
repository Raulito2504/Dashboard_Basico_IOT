"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth()

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Si está autenticado, renderizar los componentes hijos
    return <Outlet />
}

