import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import axiosInstance from '../../../api/axiosInstance.js';
import { PeticionesView } from '../components/PeticionesView.jsx';



export const PeticionesTableContainer = () => {

    const { user } = useAuth();
    const [misPeticiones, setMisPeticiones] = useState([]);
    const [peticionesRecibidas, setPeticionesRecibidas] = useState([]);
    const [vista, setVista] = useState('mias'); // 'mias' o 'recibidas'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeticiones = async () => {
        try {
            setLoading(true);
            const [mis, recibidas] = await Promise.all([
                axiosInstance.get('/peticiones/mias'),
                axiosInstance.get('/peticiones/recibidas'),
            ]);
            setMisPeticiones(mis.data.data);
            setPeticionesRecibidas(recibidas.data.data);
        } catch (error) {
            console.error('Error al obtener peticiones:', error);
            setError(error.response?.data?.message || 'Error al cargar las peticiones');
        } finally {
            setLoading(false);
        }
    }

    const responderPeticion = async (peticionId, respuesta) => {
        try {
            await axiosInstance.patch(`/peticiones/responder/${peticionId}`, { respuesta });
            // Actualizar el estado local para evitar nuevo fetch
            setPeticionesRecibidas(prev =>
                prev.map(p => p.id === peticionId
                    ? { ...p, estado: respuesta === 'aceptar' ? 'aceptada' : 'rechazada' } : p));
        } catch (err) {
            console.error('Error al responder la petición:', err);
            setError(err.response?.data?.message || 'Error al procesar la respuesta');
            throw err;
        }
    };

    useEffect(() => {
        fetchPeticiones();
    }, [user.id, vista, setVista]);


    return (
        <div>
            <PeticionesView
                vista={vista}
                setVista={setVista}
                misPeticiones={misPeticiones}
                peticionesRecibidas={peticionesRecibidas}
                loading={loading}
                error={error}
                onResponder={responderPeticion}
                onRetry={fetchPeticiones}
            />
        </div>
    )
}

