// Este archivo es opcional - puedes crear un pequeño servidor proxy si tienes problemas de CORS
// Guárdalo en una carpeta separada y ejecútalo con Node.js

const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
const PORT = 3001

// Habilitar CORS para todas las rutas
app.use(cors())

// Ruta proxy para la API
app.get("/api/iotapp", async (req, res) => {
    try {
        const response = await axios.get("https://moriahmkt.com/iotapp/")
        res.json(response.data)
    } catch (error) {
        console.error("Error al obtener datos de la API:", error)
        res.status(500).json({ error: "Error al obtener datos de la API" })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor proxy ejecutándose en http://localhost:${PORT}`)
})

// Para usar este proxy, necesitarás instalar:
// npm install express axios cors
// Y luego ejecutar: node proxy-server.js
// Después, cambia la URL en tu servicio de API a: http://localhost:3001/api/iotapp

