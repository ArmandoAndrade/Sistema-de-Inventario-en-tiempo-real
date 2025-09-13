import { io } from "../../server.js";
import Usuario from "../../models/Usuario.js";
import Sede from "../../models/Sede.js";

export const notificarRespuestaUseCase = async ({
  peticionId,
  respuesta,
  usuarioRespondedorId,
  solicitanteId
}) => {
  try {
    // 1. Primero obtener el usuario solicitante
    const solicitante = await Usuario.findByPk(solicitanteId);
    if (!solicitante) {
      throw new Error('Solicitante no encontrado');
    }

    // 2. Obtener la sede del USUARIO QUE RESPONDE (no del solicitante)
    const usuarioRespondedor = await Usuario.findByPk(usuarioRespondedorId);
    if (!usuarioRespondedor) {
      throw new Error('Usuario respondedor no encontrado');
    }

    // 3. Obtener la sede del respondedor
    const sedeRespondedora = await Sede.findByPk(usuarioRespondedor.sede_id);
    if (!sedeRespondedora) {
      throw new Error('Sede del respondedor no encontrada');
    }

    const mensaje = {
      type: 'respuesta-peticion',
      peticionId: peticionId, // <-- Añadido como campo separado
      respuesta,
      fecha: new Date().toISOString(),
      respondedor: usuarioRespondedor.nombre,
      respondedor_id: usuarioRespondedor.id,
      sede_respuesta: {
        id: sedeRespondedora.id,
        nombre: sedeRespondedora.nombre
      },
      // Añade más detalles si es necesario
      detalle: `Petición #${peticionId} ${respuesta === 'aceptada' ? 'aceptada' : 'rechazada'}`
    };

    console.log('Enviando notificación de respuesta:', mensaje); // Log para depuración

    // Enviar al solicitante específico
    io.to(`usuario:${solicitanteId}`).emit('notificacion', mensaje);

    return mensaje;
  } catch (error) {
    console.error("Error detallado en notificarRespuestaUseCase:", {
      error: error.message,
      stack: error.stack,
      params: { peticionId, respuesta, usuarioRespondedorId, solicitanteId }
    });
    throw new Error("Error al notificar la respuesta: " + error.message);
  }
};