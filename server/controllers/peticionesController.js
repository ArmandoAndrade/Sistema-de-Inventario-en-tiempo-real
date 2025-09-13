import {
    getProductsTransferUseCase,
    crearPeticionUseCase,
    notificarPeticionUseCase,
    getPeticionesUseCase,
    updatePeticionEstadoUseCase,
    getMovimientosUseCase
} from "../use_cases/peticiones/index.js";

//obtener productos
export const getProducts = async (req, res) => {
    try {
        const search = req.query.search || ""; // Extrae el término de búsqueda
        const sedeId = req.user?.sede_id || req.query.sede_id; //desde token o query param

        if (!sedeId) {
            return res.status(400).json({ error: 'sede_id es requerido' });
        }
        console.log("Buscando productos con:", { search, sedeId }); // Debug

        const productos = await getProductsTransferUseCase({ search, sedeId });
        res.json(productos);
    } catch (error) {
        console.log("Error al obtener productos:", error);
        res.status(500).json({
            error: 'Error al obtener productos',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Crear una petición de traslado
export const crearPeticionTraslado = async (req, res) => {
    try {
        const { producto_id, sede_origen_id, sede_destino_id, cantidad, observaciones } = req.body;

        // Validaciones básicas
        if (!producto_id || !sede_origen_id || !sede_destino_id || !cantidad) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (sede_origen_id === sede_destino_id) {
            return res.status(400).json({ error: 'La sede origen y destino no pueden ser iguales' });
        }

        const peticion = await crearPeticionUseCase({
            producto_id,
            sede_origen_id,
            sede_destino_id,
            cantidad,
            observaciones: observaciones || '',
            usuario_id: req.user.id // ID del usuario que solicita la petición
        });

        res.status(201).json({
            success: true,
            data: peticion,
            message: 'Petición creada y notificada correctamente'
        });
    } catch (error) {
        console.error("Error en crearPeticionTraslado:", error.message);

        const statusCode = error.message.includes('no existe') ||
            error.message.includes('mayor al inventario') ? 400 : 500;

        res.status(statusCode).json({
            error: error.message,
            detalles: 'Error al procesar la petición'
        });
    }
}

//Obtener peticiones de traslado hechas por el usuario
export const getMisPeticiones = async (req, res) => {

    try {
        const peticiones = await getPeticionesUseCase(
            req.user.id, // ID del usuario
            null,
            req.query.estado || null, // Estado de la petición (opcional)
        );

        res.json({
            success: true,
            count: peticiones.length,
            data: peticiones
        });

    } catch (error) {
        console.error("Error en getMisPeticiones:", error);
        res.status(500).json({
            error: 'Error al obtener tus peticiones',
            detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

//Obtener las peticiones de traslado recibidas por el usuario
export const getPeticionesRecibidas = async (req, res) => {

    try {
        const peticiones = await getPeticionesUseCase(
            null,         // usuarioId (no filtrar por usuario)
            req.user.sede_id, // sede_destino_id
            req.query.estado || null, // estado (default: pendiente)
            'sede_destino_id' // Filtrar por sede destino
        );

        res.json({
            success: true,
            count: peticiones.length,
            data: peticiones
        });
    } catch (error) {
        console.error("Error en getPeticionesRecibidas:", error);
        res.status(500).json({
            error: 'Error al obtener peticiones recibidas',
            detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Responder a una petición de traslado (aceptar/rechazar)
export const responsePeticion = async (req, res) => {
    try {
        const result = await updatePeticionEstadoUseCase(
            req.params.id, // ID de la petición
            req.user.id, // ID del usuario que responde
            req.body.respuesta, // Nuevo estado (aceptada/rechazada)
            req.user.sede_id // ID de la sede del usuario que responde
        );

        res.json({
            success: true,
            message: `Petición ${req.body.respuesta === 'aceptada' ? 'aceptada' : 'rechazada'} correctamente`,
            data: result
        });
    } catch (error) {
        console.error("Error en responderPeticion:", error);
        const statusCode = error.message.includes('No estás autorizado para responder esta petición.') ? 403 :
            error.message.includes('Petición no encontrada.') ? 404 :
                error.message.includes('La petición ya fue respondida.' || 'Stock insuficiente') ? 400 : 500;
        res.status(statusCode).json({
            error: 'Error al responder la petición',
            detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
        });

    }
}

//Obtener Movimientos de productos

export const getMovimientos = async (req, res) => {
    try {
        const { producto_nombre, sede_nombre, fecha_inicio, fecha_fin } = req.query;
        
        // Si el usuario no es admin, solo puede ver movimientos de su sede
        const sedeFiltro = req.user.rol === 'admin' ? sede_nombre : req.user.sede_id;

        const movimientos = await getMovimientosUseCase({
            producto_nombre,
            sede_nombre: sedeFiltro,
            fecha_inicio,
            fecha_fin
        });

        res.json({
            success: true,
            count: movimientos.length,
            data: movimientos
        });


    } catch (error) {
        console.error("Error en getMovimientos:", error);
        res.status(500).json({
            error: 'Error al obtener movimientos',
            detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/*
403 para no autorizado.
404 para no encontrado.
400 para bad request (datos inválidos).
500 para error interno del servidor.
// 200 para éxito general.
// 201 para creación exitosa de recursos.
*/ 