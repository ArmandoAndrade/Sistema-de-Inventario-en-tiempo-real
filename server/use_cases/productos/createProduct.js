import Producto from "../../models/Producto.js";
import InventarioSede from "../../models/InventarioSede.js";
import Sede from "../../models/Sede.js";
import { sequelize } from "../../config/db.js";


export const createProductUseCase = async (productoData) => {

    const transaction = await sequelize.transaction();
    try {
        const { nombre, referencia, descripcion, categoria } = productoData;

        //Validar si el producto ya existe por referencia
        const productoExiste = await Producto.findOne({
            where: { referencia },
            transaction
        });

        if (productoExiste) {
            await transaction.rollback();
            throw new Error("El producto con esa referencia ya existe");
        }

        //crear el producto
        const nuevoProducto = await Producto.create({
            nombre, referencia, descripcion, categoria
        }, { transaction });

        console.log("Producto creado:", nuevoProducto);


        //obtener las sedes
        const sedes = await Sede.findAll({ transaction });

        //Crear una Crear registros en InventarioSede con validación
        for (const sede of sedes) {
            //Validar si ya existe registro para este producto en la sede
            const existeEnSede = await InventarioSede.findOne({
                where: {
                    producto_id: nuevoProducto.id,
                    sede_id: sede.id
                },
                transaction
            });

            if(existeEnSede){
                await transaction.rollback();
                throw new Error(`El producto ya está registrado en la sede ${sede.nombre}`);
            }


            console.log(`Creando inventario para sede ${sede.id}...`);
            await InventarioSede.create({
                producto_id: nuevoProducto.id,
                sede_id: sede.id,
                stock: 0
            }, { transaction });
            console.log(`Inventario creado para sede ${sede.id}`);
        }

        await transaction.commit();
        return nuevoProducto;
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        await transaction.rollback();
        throw new Error(error.message);
    }

}

