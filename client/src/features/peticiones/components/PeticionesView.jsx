import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '../../../components/shared/Icons.jsx';
import '../styles/Peticiones.css';

const estadoStyles = {
    pendiente: 'estado-pendiente',
    aceptada: 'estado-aceptada',
    rechazada: 'estado-rechazada'
};

export const PeticionesView = ({
    vista,
    setVista,
    misPeticiones,
    peticionesRecibidas,
    loading,
    error,
    onResponder,
    onRetry
}) => {
    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Cargando peticiones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <XCircleIcon className="h-5 w-5" />
                <span>{error}</span>
                <button 
                    onClick={onRetry}
                    className="retry-button"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="peticiones-container">
            {/* Toggle */}
            <div className="toggle-buttons">
                <button
                    onClick={() => setVista('mias')}
                    className={`toggle-button ${vista === 'mias' ? 'active' : ''}`}
                >
                    Mis Peticiones ({misPeticiones.length})
                </button>
                <button
                    onClick={() => setVista('recibidas')}
                    className={`toggle-button ${vista === 'recibidas' ? 'active' : ''}`}
                >
                    Recibidas ({peticionesRecibidas.length})
                </button>
            </div>

            {/* Tablas */}
            {vista === 'mias' ? (
                <div className="table-wrapper">
                    <h2 className="section-title">Mis Peticiones</h2>
                    <table className="peticiones-table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-head-cell">Producto</th>
                                <th className="table-head-cell">Cantidad</th>
                                <th className="table-head-cell">Origen</th>
                                <th className="table-head-cell">Destino</th>
                                <th className="table-head-cell">Estado</th>
                                <th className="table-head-cell">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misPeticiones.map((p) => (
                                <tr key={p.id} className="table-row">
                                    <td className="table-cell">{p.producto.nombre}</td>
                                    <td className="table-cell text-center">{p.cantidad}</td>
                                    <td className="table-cell">{p.origen.nombre}</td>
                                    <td className="table-cell">{p.destino.nombre}</td>
                                    <td className="table-cell">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoStyles[p.estado]}`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        {new Date(p.fecha_solicitud).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="table-wrapper">
                    <h2 className="section-title">Peticiones Recibidas</h2>
                    <table className="peticiones-table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-head-cell">ID</th>
                                <th className="table-head-cell">Producto</th>
                                <th className="table-head-cell">Cantidad</th>
                                <th className="table-head-cell">Solicitante</th>
                                <th className="table-head-cell">Origen</th>
                                <th className="table-head-cell">Estado</th>
                                <th className="table-head-cell">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peticionesRecibidas.map((p) => (
                                <tr key={p.id} className="table-row">
                                    <td className="table-cell">{p.id}</td>
                                    <td className="table-cell text-center">{p.cantidad}</td>
                                    <td className="table-cell">{p.solicitante.nombre}</td>
                                    <td className="table-cell">{p.origen.nombre}</td>
                                    <td className="table-cell">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoStyles[p.estado]}`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="table-cell text-center">
                                        {p.estado === 'pendiente' && (
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => onResponder(p.id, 'aceptar')}
                                                    className="accept-button"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={() => onResponder(p.id, 'rechazar')}
                                                    className="reject-button"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};