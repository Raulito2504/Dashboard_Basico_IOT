"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Parcela } from "../services/api"

interface MapComponentProps {
    sidebarOpen?: boolean // Prop para detectar cambios en el sidebar
    parcelas: Parcela[] // Parcelas obtenidas de la API
    onParcelaSelect?: (parcela: Parcela) => void // Función para manejar la selección de parcela
    selectedParcelaId?: number // ID de la parcela seleccionada
}

export default function MapComponent({ sidebarOpen, parcelas, onParcelaSelect, selectedParcelaId }: MapComponentProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const markersRef = useRef<{ marker: mapboxgl.Marker; parcela: Parcela }[]>([])
    const [mapLoaded, setMapLoaded] = useState(false)

    // Inicializar el mapa
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            mapboxgl.accessToken =
                "pk.eyJ1IjoicmF1bGFudG8iLCJhIjoiY20yOTFnbXBoMDBqdTJyb211cjdwcmt3diJ9.KqzoK_itiWZRVfevKb9j_A"

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/raulanto/cm3z7570700vl01rwbrl0h8wh",
                center: [-86.87200723673159, 21.062975433767964], // Coordenadas de Cancún
                zoom: 11, // Reducido el zoom para ver más ubicaciones
            })

            // Controles de navegación
            map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

            // Esperar a que el mapa se cargue para agregar los marcadores
            map.current.on("load", () => {
                console.log("Mapa cargado correctamente")
                setMapLoaded(true)

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
                    .custom-marker {
                        cursor: pointer;
                        transition: transform 0.2s;
                    }
                    .custom-marker:hover {
                        transform: scale(1.2);
                    }
                    .custom-marker.selected {
                        filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.8));
                        transform: scale(1.3);
                    }
                `
                document.head.appendChild(style)
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
    const addParcelasMarkers = (parcelas: Parcela[]) => {
        // Limpiar marcadores anteriores
        markersRef.current.forEach(({ marker }) => marker.remove())
        markersRef.current = []

        console.log(`Agregando ${parcelas.length} marcadores al mapa`)

        parcelas.forEach((parcela) => {
            // Crear un elemento personalizado para el marcador
            const el = document.createElement("div")
            el.className = `custom-marker ${parcela.id === selectedParcelaId ? "selected" : ""}`
            el.style.width = "25px"
            el.style.height = "25px"
            el.style.backgroundImage =
                'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2225%22 height%3D%2225%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%2300CED1%22 stroke-width%3D%222%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%3E%3Cpath d%3D%22M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z%22%3E%3C%2Fpath%3E%3Ccircle cx%3D%2212%22 cy%3D%2210%22 r%3D%223%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E")'
            el.style.backgroundSize = "100%"
            el.style.cursor = "pointer"

            // Agregar evento de clic para seleccionar la parcela
            el.addEventListener("click", () => {
                if (onParcelaSelect) {
                    onParcelaSelect(parcela)
                }
            })

            console.log(`Agregando marcador para parcela ${parcela.id} en [${parcela.longitud}, ${parcela.latitud}]`)

            // Crear el popup con la información de la parcela
            const popup = new mapboxgl.Popup({ offset: 25, className: "custom-popup" }).setHTML(`
                <div style="padding: 8px;">
                    <h3 style="margin: 0 0 8px 0; color: #00CED1; font-weight: bold;">${parcela.nombre}</h3>
                    <p style="margin: 0; font-size: 12px;">Cultivo: ${parcela.tipo_cultivo}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Ubicación: ${parcela.ubicacion}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Responsable: ${parcela.responsable}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">Último riego: ${parcela.ultimo_riego}</p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 206, 209, 0.3);">
                        <p style="margin: 0; font-size: 12px;">Humedad: ${parcela.sensor.humedad}%</p>
                        <p style="margin: 0; font-size: 12px;">Temperatura: ${parcela.sensor.temperatura}°C</p>
                        <p style="margin: 0; font-size: 12px;">Lluvia: ${parcela.sensor.lluvia} mm</p>
                        <p style="margin: 0; font-size: 12px;">Sol: ${parcela.sensor.sol}%</p>
                    </div>
                    <div style="margin-top: 8px; text-align: center;">
                        <button 
                            style="background-color: rgba(0, 206, 209, 0.2); border: 1px solid rgba(0, 206, 209, 0.5); color: #00CED1; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                            onclick="document.dispatchEvent(new CustomEvent('selectParcela', {detail: ${parcela.id}}))"
                        >
                            Ver datos en panel
                        </button>
                    </div>
                </div>
            `)

            try {
                // Agregar el marcador al mapa
                if (map.current) {
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([parcela.longitud, parcela.latitud])
                        .setPopup(popup)
                        .addTo(map.current)

                    markersRef.current.push({ marker, parcela })
                } else {
                    console.error("El mapa no está inicializado al intentar agregar marcadores")
                }
            } catch (error) {
                console.error(`Error al agregar marcador para parcela ${parcela.id}:`, error)
            }
        })

        // Agregar evento personalizado para manejar clics en el botón del popup
        document.addEventListener("selectParcela", (e: Event) => {
            const customEvent = e as CustomEvent
            const parcelaId = customEvent.detail
            const parcela = parcelas.find((p) => p.id === parcelaId)
            if (parcela && onParcelaSelect) {
                onParcelaSelect(parcela)
            }
        })
    }

    // Efecto para agregar marcadores cuando se cargan las parcelas y el mapa está listo
    useEffect(() => {
        console.log("Parcelas o estado del mapa cambiado:", {
            parcelasLength: parcelas.length,
            mapLoaded,
            mapInitialized: !!map.current,
        })

        if (map.current && mapLoaded && parcelas.length > 0) {
            console.log("Condiciones cumplidas para agregar marcadores")
            addParcelasMarkers(parcelas)
        }
    }, [parcelas, mapLoaded, selectedParcelaId])

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
                <p className="text-xs text-gray-300">Región Sur</p>
                {parcelas.length > 0 ? (
                    <p className="text-xs text-primary mt-1">{parcelas.length} parcelas cargadas</p>
                ) : (
                    <p className="text-xs text-yellow-400 mt-1">No hay parcelas para mostrar</p>
                )}
                {selectedParcelaId && (
                    <p className="text-xs text-accent mt-1">
                        {parcelas.find((p) => p.id === selectedParcelaId)?.nombre || "Parcela"} seleccionada
                    </p>
                )}
            </div>
            <div ref={mapContainer} className="h-full w-full" />
        </div>
    )
}

