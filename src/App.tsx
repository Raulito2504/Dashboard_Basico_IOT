import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { IotDataProvider } from "./context/IotDataContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Analysis from "./pages/Analysis"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <AuthProvider>
      <IotDataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/404" element={<NotFound />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Ruta para cualquier otra URL */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </IotDataProvider>
    </AuthProvider>
  )
}

export default App