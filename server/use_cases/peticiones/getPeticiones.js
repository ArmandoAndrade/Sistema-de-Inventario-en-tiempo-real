import PeticionTraslado from '../../models/PeticionTraslado.js'
import Producto from '../../models/Producto.js';
import Sede from '../../models/Sede.js';
import Usuario from '../../models/Usuario.js';


export const getPeticionesUseCase = async (usuarioId = null, sedeId = null, estado = null, sedeCampo = 'sede_origen_id') => {

    try {
        const peticiones = await PeticionTraslado.findAll({
            where: {
                ...(usuarioId && { usuario_solicita_id: usuarioId }),
                ...(sedeId && { [sedeCampo]: sedeId }),
                ...(estado && { estado: estado })
            },
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Sede,
                    as: 'origen',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Sede,
                    as: 'destino',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Usuario,
                    as: 'solicitante',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Usuario,
                    as: 'respondedor',
                    attributes: ['id', 'nombre', 'email'],
                    required: false // Puede que no haya respondedor si aún está pendiente
                }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        return peticiones
    } catch (error) {
        console.error('Error en getPeticionesUseCase:', error);
        throw new Error('Error al obtener peticiones');
    }
}
