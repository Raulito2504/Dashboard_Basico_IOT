import axios from "axios";

export interface HistoricalDataPoint {
    _id: {
        year: number;
        month: number;
        day: number;
        hour?: number;
    };
    temperatura: number;
    humedad: number;
    lluvia: number;
    sol: number;
    timestamp: string;
}

export interface DeletedParcelaInfo {
    parcelaId: number;
    nombre: string;
    tipo_cultivo: string;
    lastReading: {
        timestamp: string;
        temperatura: number;
        humedad: number;
        lluvia: number;
        sol: number;
    };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchHistoricalData = async (parcelaId?: number, days = 7, interval = 'hour'): Promise<HistoricalDataPoint[]> => {
    try {
        const url = parcelaId
            ? `${API_URL}/history/parcelas/${parcelaId}?days=${days}&interval=${interval}`
            : `${API_URL}/history/sensors?days=${days}&interval=${interval}`;

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching historical data:", error);
        throw error;
    }
};

export const fetchDeletedParcelas = async (): Promise<DeletedParcelaInfo[]> => {
    try {
        const response = await axios.get(`${API_URL}/parcelas/deleted`);
        return response.data;
    } catch (error) {
        console.error("Error fetching deleted parcelas:", error);
        throw error;
    }
};