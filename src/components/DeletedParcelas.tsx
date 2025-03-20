import { useState, useEffect } from "react";
import { fetchDeletedParcelas, type DeletedParcelaInfo } from "../services/historicalDataService";
import { Trash2 } from "lucide-react";

const DeletedParcelas = () => {
    const [parcelas, setParcelas] = useState<DeletedParcelaInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchDeletedParcelas();
                setParcelas(data);
            } catch (err) {
                setError("Error al cargar las parcelas eliminadas");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-primary">Cargando parcelas eliminadas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">{error}</div>
            </div>
        );
    }

    if (parcelas.length === 0) {
        return (
            <div className="bg-card rounded-lg border border-border p-6 h-full">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Trash2 size={48} className="text-muted-foreground" />
                    <p className="text-muted-foreground text-center">No hay parcelas eliminadas en el sistema</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border p-4 h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                    <Trash2 size={20} className="mr-2 text-destructive" />
                    Parcelas Eliminadas
                </h2>
                <span className="bg-destructive/20 text-destructive px-2 py-1 rounded-full text-xs">
                    {parcelas.length} parcelas
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-muted text-muted-foreground">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Tipo de Cultivo</th>
                            <th className="px-4 py-2 text-left">Última Medición</th>
                            <th className="px-4 py-2 text-left">Temperatura</th>
                            <th className="px-4 py-2 text-left">Humedad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcelas.map((parcela) => (
                            <tr key={parcela.parcelaId} className="border-t border-border/20 hover:bg-muted/30">
                                <td className="px-4 py-3">{parcela.parcelaId}</td>
                                <td className="px-4 py-3 font-medium">{parcela.nombre}</td>
                                <td className="px-4 py-3">{parcela.tipo_cultivo}</td>
                                <td className="px-4 py-3">
                                    {new Date(parcela.lastReading.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">{parcela.lastReading.temperatura.toFixed(1)}°C</td>
                                <td className="px-4 py-3">{parcela.lastReading.humedad.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeletedParcelas;