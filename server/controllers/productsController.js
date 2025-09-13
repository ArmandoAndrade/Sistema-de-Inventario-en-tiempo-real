import {
    createProductUseCase,
    getProductsUseCase,
    getStockTotalProductUseCase,
    updateProductUseCase,
    addExistingProductToSedeUseCase,
    getStockLowProductsUseCase
} from "../use_cases/productos/index.js";



//obtener productos filtrando por sede
export const getProducts = async (req, res) => {
    try {
        const sedeUsuario = req.user?.sede_id || req.query.sede_id; //desde token o query param
        const productos = await getProductsUseCase(sedeUsuario);
        res.json(productos);
    } catch (error) {
        console.log("Error al obtener productos:", error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

//obtener la sumatoria de todos los productos de las 3 sedes
export const getStockTotalProduct = async (req, res) => {
    try {
        const respuesta = await getStockTotalProductUseCase();
        res.json(respuesta);
    } catch (error) {
        console.error("Error al obtener stock total por producto:", error);
        res.status(500).json({ error: 'Error al obtener stock total' });
    }
}

//obtener productos con bajo stock
export const getStockLowProducts = async (req, res) => {

    try {
        const sedeId = parseInt(req.query.sede_id);
        const threshold = parseInt(req.query.threshold || 25);

        const productos = await getStockLowProductsUseCase(sedeId, threshold);

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos con bajo stock:", error.message);
        res.status(400).json({ error: error.message });
    }
}

//crear producto
export const createProduct = async (req, res) => {
    try {
        const nuevoProducto = await createProductUseCase(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error en createProduct:", error.message);
        res.status(400).json({ error: error.message });
    }
}

//agregar stock de un producto a una sede
export const addExistingProductToSede = async (req, res) => {

    try {

        const nuevoInventario = await addExistingProductToSedeUseCase({
            referencia: req.body.referencia,
            stock: req.body.stock,
            sedeDestino: req.body.sede_id,
            user: req.user
        });
        res.status(201).json({
            mensaje: "Producto agregado a la sede correctamente",
            inventario: nuevoInventario
        });
    } catch (error) {
        console.error("Error al agregar producto existente a sede:", error.message);
        res.status(400).json({ error: error.message });
    }
}

//actualizar producto
export const updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const sede_id = parseInt(req.body.sede_id);
    const userRole = req.body.user_rol;
    try {
        const productoActualizado = await updateProductUseCase(id, sede_id, req.body, userRole);
        res.json({ mensage: "Producto actualizado", producto: productoActualizado })
    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        res.status(400).json({ error: error.message });
    }
}

