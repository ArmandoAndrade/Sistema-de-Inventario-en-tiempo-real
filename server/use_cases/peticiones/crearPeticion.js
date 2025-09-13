import PeticionTraslado from "../../models/PeticionTraslado.js";
import { notificarPeticionUseCase } from "../notificaciones/notificarPeticion.js";
import InventarioSede from "../../models/InventarioSede.js";

export const crearPeticionUseCase = async (data) => {
    const { producto_id, sede_origen_id, sede_destino_id, cantidad, observaciones, usuario_id } = data;

    // Validar que exista inventario en la sede origen
    const inventarioOrigen = await InventarioSede.findOne({
        where: {
            producto_id,
            sede_id: sede_origen_id
        }
    });
    if (!inventarioOrigen) {
        throw new Error('El producto no existe en la sede origen');
    }
    

    // Validar que exista inventario en la sede destino
    const inventarioDestino = await InventarioSede.findOne({
        where: {
            producto_id,
            sede_id: sede_destino_id
        }
    });
    if (!inventarioDestino) {
        throw new Error('El producto no existe en la sede destino');
    }
    if (inventarioDestino.cantidad < cantidad) {
        throw new Error('Cantidad solicitada mayor al inventario disponible en la sede destino');
    }

    const peticion = await PeticionTraslado.create({
        producto_id,
        sede_origen_id,
        sede_destino_id,
        cantidad,
        observaciones,
        usuario_solicita_id: usuario_id,
        estado: 'pendiente'
    });

    // Notificar a la sede destino
    await notificarPeticionUseCase(
        {
            peticionId: peticion.id,
            producto_id,
            sede_origen_id,
            sede_destino_id,
            cantidad,
            usuario_id
        }
    ).catch(error => {
        console.error('Error al notificar:', error);
    });

    return peticion;
}