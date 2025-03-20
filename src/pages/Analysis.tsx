import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChartShowcase from "../components/ChartShowcase";
import DeletedParcelas from "../components/DeletedParcelas";
import { useAuth } from "../context/AuthContext";
import { useIotData } from "../context/IotDataContext";
import { BarChart, ArrowRight } from "lucide-react";

export default function Analysis() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(null);
    const { logout } = useAuth();
    const { parcelas } = useIotData();

    const selectedParcela = selectedParcelaId
        ? parcelas.find(p => p.id === selectedParcelaId) || null
        : null;

    return (
        <div className="flex flex-col min-h-screen bg-secondary text-white">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={logout} />

            <div className="flex flex-1 overflow-hidden">
                {sidebarOpen && <Sidebar />}

                <main className="flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold flex items-center">
                            <BarChart className="mr-2 text-primary" />
                            Análisis de Datos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Visualización de datos históricos y parcelas eliminadas del sistema
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => setSelectedParcelaId(null)}
                                className={`px-4 py-2 rounded-md ${!selectedParcelaId ? 'bg-primary text-background' : 'bg-muted hover:bg-muted/80'}`}
                            >
                                Datos Generales
                            </button>
                            {parcelas.map(parcela => (
                                <button
                                    key={parcela.id}
                                    onClick={() => setSelectedParcelaId(parcela.id)}
                                    className={`px-4 py-2 rounded-md ${selectedParcelaId === parcela.id ? 'bg-primary text-background' : 'bg-muted hover:bg-muted/80'}`}
                                >
                                    {parcela.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <ChartShowcase selectedParcela={selectedParcela} />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold flex items-center mb-4">
                            <ArrowRight className="mr-2 text-destructive" />
                            Parcelas Eliminadas
                        </h2>
                        <DeletedParcelas />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}