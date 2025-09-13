import Movimiento from "../../models/Movimiento.js";
import PeticionTraslado from "../../models/PeticionTraslado.js";
import InventarioSede from "../../models/InventarioSede.js";
import { sequelize } from "../../config/db.js";
import { notificarRespuestaUseCase } from "../notificaciones/notificarRespuesta.js";

/**
 * Responde una petición de traslado, aceptándola o rechazándola.
 * 
 * @param {Object} params
 * @param {number} params.peticionId - ID de la petición.
 * @param {'aceptar'|'rechazar'} params.respuesta - Acción a tomar.
 * @param {number} params.usuarioId - ID del usuario autenticado.
 *  @param {number} params.sedeIdUsuario - Sede del usuario autenticado.
 */

export const updatePeticionEstadoUseCase = async (peticionId, usuarioId, respuesta, sedeIdUsuario) => {

    const transaction = await sequelize.transaction();
    try {

        const peticion = await PeticionTraslado.findByPk(peticionId, {
            transaction,
            include: ['solicitante'] // Añadimos esto para obtener el usuario que hizo la petición
        });
        //Validaciones
        if (!peticion) throw new Error("Petición no encontrada.");
        if (peticion.estado !== 'pendiente') throw new Error("La petición ya fue respondida.");
        if (sedeIdUsuario !== peticion.sede_destino_id) throw new Error("No estás autorizado para responder esta petición.");
        if (!['aceptar', 'rechazar'].includes(respuesta)) throw new Error("Respuesta inválida.");

        let estadoActualizado;
        if (respuesta === 'rechazar') {
            estadoActualizado = 'rechazada';
            await peticion.update({
                estado: 'rechazada',
                fecha_respuesta: new Date(),
                usuario_responde_id: usuarioId,
                observaciones: 'Rechazada por la sede destino'
            }, { transaction });
        } else if (respuesta === 'aceptar') {
            estadoActualizado = 'aceptada';

            const [inventarioSedeEnvía, inventarioSedeRecibe] = await Promise.all([
                // Verificar si hay suficiente stock en la sede que envía (sede destino)
                InventarioSede.findOne({
                    where: {
                        producto_id: peticion.producto_id,
                        sede_id: peticion.sede_destino_id // La sede destino es la que envía
                    },
                    transaction
                }),

                // Verificar si existe inventario en la sede que recibe (sede origen)
                InventarioSede.findOne({
                    where: {
                        producto_id: peticion.producto_id,
                        sede_id: peticion.sede_origen_id
                    },
                    transaction
                })
            ]);

            if (!inventarioSedeEnvía || inventarioSedeEnvía.stock < peticion.cantidad) {
                throw new Error(`Stock insuficiente en la sede que envía (sede destino). Disponible: ${inventarioSedeEnvía ? inventarioSedeEnvía.stock : 0}, Solicitado: ${peticion.cantidad}`);
            }

            if (!inventarioSedeRecibe) {
                throw new Error("Inventario no encontrado en la sede que recibe (sede origen).");
            }

            await Promise.all([
                // 1. Descontar de la sede destino (envía)
                inventarioSedeEnvía.update({
                    stock: inventarioSedeEnvía.stock - peticion.cantidad
                }, { transaction }),

                // 2. Sumar stock en la sede que recibe (sede origen)
                inventarioSedeRecibe.update({
                    stock: inventarioSedeRecibe.stock + peticion.cantidad
                }, { transaction }),

                // 3. Registrar movimiento
                Movimiento.create({
                    producto_id: peticion.producto_id,
                    cantidad: peticion.cantidad,
                    sede_origen_id: peticion.sede_destino_id, // ¡Importante! Origen es quien envía (sede destino)
                    sede_destino_id: peticion.sede_origen_id, // Destino es quien recibe (sede origen)
                    usuario_id: usuarioId,
                    tipo: 'traslado',
                    observaciones: `Traslado aceptado. Petición ID: ${peticion.id}`
                }, { transaction }),


            ]);

            // 4. Actualizar petición
            await peticion.update({
                estado: 'aceptada',
                fecha_respuesta: new Date(),
                usuario_responde_id: usuarioId
            }, { transaction });
        }


        await transaction.commit(); // Confirmar la transacción

        // Notificar al usuario que hizo la petición
        try {
            await notificarRespuestaUseCase({
                peticionId,
                respuesta: estadoActualizado,
                usuarioRespondedorId: usuarioId,
                solicitanteId: peticion.solicitante.id
            });
        } catch (notifyError) {
            console.error("Error al notificar, pero la transacción ya fue exitosa:", notifyError);
            // No re-lanzamos el error para no afectar la operación principal
        }

        // Obtener la petición actualizada SIN transacción
        return await PeticionTraslado.findByPk(peticionId, {
            include: ['producto', 'origen', 'destino']
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error al actualizar el estado de la petición en updatePeticionEstadoUseCase:", error.message);
        throw error;
    }

};