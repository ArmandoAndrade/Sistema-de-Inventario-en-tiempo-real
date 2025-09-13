import Producto from "../models/Producto.js";
import InventarioSede from "../models/InventarioSede.js";
import Usuario from "../models/Usuario.js";
import Sede from "../models/Sede.js";
import { sequelize } from "../config/db.js";
//obtener todos los productos

// Obtener todos los productos filtrados por sede
export const getProducts = async (req, res) => {
    const sedeUsuario = req.user?.sede_id || req.query.sede_id; //desde token o query param

    try {
        const productos = await InventarioSede.findAll({
            where: sedeUsuario ? { sede_id: sedeUsuario } : {},
            include: [
                {
                    model: Producto,
                    as: "producto",
                    required: true,// evita traer registros sin relación
                },
                {
                    model: Sede,
                    as: "sede"
                }
            ]
        });

        res.json(productos);
    } catch (error) {
        console.log("Error al obtener productos 1:", error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

//obtener todos los productos
export const getStockTotalProduct = async (req, res) => {
    try {
        const stockTotal = await InventarioSede.findAll({
            attributes: [
                'producto_id',
                [sequelize.fn('SUM', sequelize.col('stock')), 'stock_total']//sumar el stock
            ],
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['nombre', 'referencia', 'categoria', 'descripcion']
                }
            ],
            group: ['producto_id', 'producto.id']
        })

        const respuesta = stockTotal.map((item) => ({
            producto_id: item.producto_id,
            stock_total: item.get('stock_total'),
            nombre: item.producto?.nombre ?? 'N/A',
            referencia: item.producto?.referencia ?? 'N/A',
            categoria: item.producto?.categoria ?? 'N/A',
            descripcion: item.producto?.descripcion ?? 'N/A'
        }));
        

        res.json(respuesta);
    } catch (error) {
        console.error("Error al obtener stock total por producto:", error);
        res.status(500).json({ error: 'Error al obtener stock total' });
    }
}
//crear nuevo producto en sede
export const createProduct = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { nombre, referencia, descripcion, categoria } = req.body;
       

        const nuevoProducto = await Producto.create({
            nombre, referencia, descripcion, categoria
        }, { transaction });

        console.log("Producto creado:", nuevoProducto);


        
        await transaction.commit();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
}

//actualizar producto solo si pertenece a la sede del usuario
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const sede_id = req.user.sede_id;
    const transaction = await sequelize.transaction();

    try {
        //verificar si el producto pertenece a la sede del usuario
        const inventario = await InventarioSede.findOne({
            where: { producto_id: id, sede_id },
            transaction
        })

        if (!inventario) {
            await transaction.rollback();
            return res.status(403).json({ erro: "No tiene permiso para modificar este producto" })
        }

        //actualizar producto
        const producto = await Producto.findByPk(id, { transaction });
        const { id: _id, createdAt, updatedAt, stock, ...camposActualizables } = req.body;
        await producto.update(camposActualizables, { transaction });

        //actualizar stock en la sede
        if (typeof stock === 'number') {
            await inventario.update({ stock }, { transaction });
        }

        await transaction.commit();
        res.json({ mensage: "Producto actualizado", producto });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
}

// Agregar un producto existente a una sede nueva (por referencia)
export const addExistingProductToSede = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { referencia, stock, sede_id: sedeDestino } = req.body;
        const user = req.user;

        //determinar a que sede se agrega el producto
        const sede_id = await user.rol === 'admin' ? sedeDestino : sede_id;

        if (!sede_id) {
            await transaction.rollback();
            return res.status(400).json({ error: "Debe especificar una sede válida" });
          }

        // Buscar el producto por referencia
        const producto = await Producto.findOne({
            where: { referencia },
            transaction
        });

        if (!producto) {
            await transaction.rollback();
            return res.status(404).json({ error: "El producto con esa referencia no existe" });
        }

        // Verificar que NO esté ya registrado en esta sede
        const existente = await InventarioSede.findOne({
            where: { producto_id: producto.id, sede_id },
            transaction
        });

        if (existente) {
            await transaction.rollback();
            return res.status(409).json({ error: "El producto ya está registrado en esta sede" });
        }

        // Registrar el producto en la sede
        const nuevoInventario = await InventarioSede.create({
            producto_id: producto.id,
            sede_id,
            stock
        }, { transaction });

        await transaction.commit();
        res.status(201).json({
            mensaje: "Producto agregado a la sede correctamente",
            inventario: nuevoInventario
        });

    } catch (error) {
        console.error("Error al agregar producto existente a sede:", error.message);
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};


// Eliminar producto solo si pertenece a la sede del usuario
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const sede_id = req.user.sede_id;
    const transaction = await sequelize.transaction();

    try {
        const inventario = await InventarioSede.findOne({
            where: { producto_id: id, sede_id },
            transaction
        });

        if (!inventario) {
            await transaction.rollback();
            return res.status(403).json({ error: "No tienes permiso para eliminar este producto" });
        }

        //eliminar producto
        await inventario.destroy({ transaction });
        await Producto.destroy({ where: { id }, transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
}