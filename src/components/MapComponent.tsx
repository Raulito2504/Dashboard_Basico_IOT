"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Parcela } from "../services/api"

interface MapComponentProps {
    sidebarOpen?: boolean
    parcelas?: Parcela[]
}

export default function MapComponent({ sidebarOpen, parcelas = [] }: MapComponentProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)

    // Inicializar el mapa
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            mapboxgl.accessToken =
                "pk.eyJ1IjoicmF1bGFudG8iLCJhIjoiY20yOTFnbXBoMDBqdTJyb211cjdwcmt3diJ9.KqzoK_itiWZRVfevKb9j_A"

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/raulanto/cm3z7570700vl01rwbrl0h8wh",
                center: [-86.87436454154599, 21.063013076491483], // Coordenadas de Cancún
                zoom: 11, // Reducido el zoom para ver más ubicaciones
            })

            // Controles de navegación
            map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

            // Esperar a que el mapa se cargue para agregar los marcadores
            map.current.on("load", () => {
                // Agregar estilos personalizados para los popups
                const style = document.createElement("style")
                style.textContent = `
                    .custom-popup .mapboxgl-popup-content {
                        background-color: rgba(10, 25, 41, 0.9);
                        color: white;
                        border: 1px solid rgba(0, 206, 209, 0.3);
                        border-radius: 8px;
                        padding: 0;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    }
                    .custom-popup .mapboxgl-popup-tip {
                        border-top-color: rgba(10, 25, 41, 0.9);
                        border-bottom-color: rgba(10, 25, 41, 0.9);
                    }
                    .custom-popup .mapboxgl-popup-close-button {
                        color: #00CED1;
                        font-size: 16px;
                        padding: 5px 8px;
                    }
                `
                document.head.appendChild(style)

                // Si hay parcelas, agregar marcadores
                if (parcelas && parcelas.length > 0) {
                    addParcelas()
                }
            })
        }

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    // Función para agregar marcadores de parcelas
    const addParcelas = () => {
        if (!map.current || !parcelas || parcelas.length === 0) return

        // Limpiar marcadores existentes
        const existingMarkers = document.querySelectorAll(".custom-marker")
        existingMarkers.forEach((marker) => marker.remove())

        // Agregar marcadores con popups para cada parcela
        parcelas.forEach((parcela) => {
            // Crear un elemento personalizado para el marcador
            const el = document.createElement("div")
            el.className = "custom-marker"
            el.style.width = "25px"
            el.style.height = "25px"
            el.style.backgroundImage =
                'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2225%22 height%3D%2225%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%2300CED1%22 stroke-width%3D%222%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%3E%3Cpath d%3D%22M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z%22%3E%3C%2Fpath%3E%3Ccircle cx%3D%2212%22 cy%3D%2210%22 r%3D%223%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E")'
            el.style.backgroundSize = "100%"
            el.style.cursor = "pointer"

            // Crear el popup con la información de la parcela
            const popup = new mapboxgl.Popup({ offset: 25, className: "custom-popup" }).setHTML(`
                <div style="padding: 8px;">
                    <h3 style="margin: 0 0 8px 0; color: #00CED1; font-weight: bold;">${parcela.nombre}</h3>
                    <p style="margin: 0; font-size: 12px;">Cultivo: ${parcela.tipo_cultivo}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Ubicación: ${parcela.ubicacion}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Responsable: ${parcela.responsable}</p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 206, 209, 0.3);">
                        <p style="margin: 0; font-size: 12px;">Humedad: ${parcela.sensor.humedad.toFixed(1)}%</p>
                        <p style="margin: 0; font-size: 12px;">Temperatura: ${parcela.sensor.temperatura.toFixed(1)}°C</p>
                        <p style="margin: 0; font-size: 12px;">Lluvia: ${parcela.sensor.lluvia.toFixed(1)} mm</p>
                        <p style="margin: 0; font-size: 12px;">Sol: ${parcela.sensor.sol.toFixed(0)}%</p>
                    </div>
                </div>
            `)

            // Agregar el marcador al mapa
            new mapboxgl.Marker(el).setLngLat([parcela.longitud, parcela.latitud]).setPopup(popup).addTo(map.current!)
        })
    }

    // Efecto para agregar marcadores cuando cambian las parcelas
    useEffect(() => {
        if (map.current && parcelas && parcelas.length > 0) {
            // Esperar a que el mapa esté cargado
            if (map.current.loaded()) {
                addParcelas()
            } else {
                map.current.on("load", addParcelas)
            }
        }
    }, [parcelas])

    // Efecto para redimensionar el mapa cuando cambia el sidebar
    useEffect(() => {
        if (map.current) {
            // Pequeño retraso para permitir que el DOM se actualice primero
            setTimeout(() => {
                map.current?.resize()
            }, 200)
        }
    }, [sidebarOpen])

    return (
        <div className="relative h-full rounded-xl overflow-hidden border border-primary/30">
            <div className="absolute top-4 left-4 z-10 bg-panel-bg p-3 rounded-lg border border-primary/30">
                <h2 className="text-primary font-bold text-lg">Mapa de Cultivos</h2>
                <p className="text-xs text-gray-300">Parcelas Activas: {parcelas?.length || 0}</p>
            </div>
            <div ref={mapContainer} className="h-full w-full" />
        </div>
    )
}

