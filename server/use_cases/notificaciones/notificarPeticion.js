import { io } from "../../server.js";
import Sede from "../../models/Sede.js";
import Usuario from "../../models/Usuario.js";

export const notificarPeticionUseCase = async ({ peticionId, producto_id, sede_origen_id, sede_destino_id, cantidad, usuario_id }) => {

    try {
        // Obtener información adicional para una mejor notificación
        const [usuario, sedeOrigen, sedeDestino] = await Promise.all([
            Usuario.findByPk(usuario_id),
            Sede.findByPk(sede_origen_id),
            Sede.findByPk(sede_destino_id)
        ]);


        if (!usuario || !sedeOrigen || !sedeDestino) {
            throw new Error('No se encontró información necesaria para la notificación');
        }
        // Agrega logs de depuración
        console.log('Datos obtenidos para notificación:', {
            usuario: usuario?.toJSON(),
            sedeOrigen: sedeOrigen?.toJSON(),
            sedeDestino: sedeDestino?.toJSON()
        });
        
        const mensaje = {
            type: 'nueva petición',
            id: peticionId,
            producto_id,
            sede_origen: {
                id: sede_origen_id,
                nombre: sedeOrigen.nombre || 'Sede desconocida' // Valor por defecto
            },
            sede_destino: {
                id: sede_destino_id,
                nombre: sedeDestino.nombre || 'Sede desconocida' // Valor por defecto
            },
            cantidad,
            fecha: new Date().toISOString(),
            solicitante: usuario.nombre || 'Usuario desconocido', // Valor por defecto
            solicitante_id: usuario.id
        }

        // Enviar a todos en la sede destino
        io.to(`sede:${sede_destino_id}`).emit('notificacion', mensaje);

        return mensaje;
    } catch (error) {
        console.error("Error en notificarPeticionUseCase:", error);
        throw new Error("Error al notificar la petición");
    }


}