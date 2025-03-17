import { useIotData } from "../context/IotDataContext"


export default function ParcelasTable() {
    const { parcelas, loading, error } = useIotData()

    if (loading) {
        return <div className="text-center p-4 text-primary">Cargando datos de parcelas...</div>
    }

    if (error || !parcelas.length) {
        return (
            <div className="text-center p-4 text-destructive">{error || "No se pudieron cargar los datos de parcelas"}</div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-primary/30">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted">
                        <th className="px-4 py-3 text-left font-medium text-primary">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Nombre</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Ubicación</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Responsable</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Cultivo</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Último Riego</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Humedad</th>
                        <th className="px-4 py-3 text-left font-medium text-primary">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {parcelas.map((parcela) => (
                        <tr key={parcela.id} className="border-t border-primary/10 hover:bg-muted/50">
                            <td className="px-4 py-3">{parcela.id}</td>
                            <td className="px-4 py-3 font-medium">{parcela.nombre}</td>
                            <td className="px-4 py-3">{parcela.ubicacion}</td>
                            <td className="px-4 py-3">{parcela.responsable}</td>
                            <td className="px-4 py-3">{parcela.tipo_cultivo}</td>
                            <td className="px-4 py-3">{parcela.ultimo_riego}</td>
                            <td className="px-4 py-3">{parcela.sensor.humedad}%</td>
                            <td className="px-4 py-3">{parcela.sensor.temperatura}°C</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

