import Movimiento from '../../models/Movimiento.js';
import Producto from '../../models/Producto.js';
import Sede from '../../models/Sede.js';
import Usuario from '../../models/Usuario.js';
import { Op } from 'sequelize';

export const getMovimientosUseCase = async (filters = {}) => {
    try {
        const { producto_nombre, sede_nombre, fecha_inicio, fecha_fin } = filters;
        
        const whereClause = {};
        const includeClause = [
            {
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre'],
                ...(producto_nombre && {
                    where: {
                        nombre: {
                            [Op.iLike]: `%${producto_nombre}%`
                        }
                    }
                })
            },
            {
                model: Sede,
                as: 'origen',
                attributes: ['id', 'nombre'],
                ...(sede_nombre && {
                    where: {
                        [Op.or]: [
                            { nombre: { [Op.iLike]: `%${sede_nombre}%` }},
                            { id: isNaN(sede_nombre) ? null : parseInt(sede_nombre) }
                        ].filter(cond => cond.id !== null) // Filtramos null si sede_nombre no es número
                    }
                })
            },
            {
                model: Sede,
                as: 'destino',
                attributes: ['id', 'nombre']
            },
            {
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nombre']
            }
        ];

        // Resto del código permanece igual...

        // Filtro por fecha
        if (fecha_inicio || fecha_fin) {
            whereClause.fecha = {};
            if (fecha_inicio) whereClause.fecha[Op.gte] = new Date(fecha_inicio);
            if (fecha_fin) whereClause.fecha[Op.lte] = new Date(fecha_fin);
        }

        const movimientos = await Movimiento.findAll({
            where: whereClause,
            include: includeClause,
            order: [['fecha', 'DESC']]
        });

        return movimientos;
    } catch (error) {
        console.error('Error en getMovimientosUseCase:', error);
        throw new Error('Error al obtener movimientos');
    }
}