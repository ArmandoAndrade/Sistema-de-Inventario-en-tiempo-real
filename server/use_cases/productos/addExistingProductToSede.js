import Producto from "../../models/Producto.js";
import InventarioSede from "../../models/InventarioSede.js";
import { sequelize } from "../../config/db.js";


export const addExistingProductToSedeUseCase = async ( {referencia, stock, sedeDestino, user} ) => {
    const transaction = await sequelize.transaction();

    try {
        //determinar a que sede se agrega el producto
        const sede_id = await user.rol === 'admin' ? sedeDestino : user.sede_id;

        if (!sede_id) {
            await transaction.rollback();
            throw new Error("Debe especificar una sede válida");
        }

        // Buscar el producto por referencia
        const producto = await Producto.findOne({
            where: { referencia },
            transaction
        });

        if (!producto) {
            await transaction.rollback();
            throw new Error("El producto con esa referencia no existe");
        }

        // Verificar que NO esté ya registrado en esta sede
        const existente = await InventarioSede.findOne({
            where: { producto_id: producto.id, sede_id },
            transaction
        });

        if (existente) {
            await transaction.rollback();
            throw new Error("El producto ya está registrado en esta sede");
        }

        const nuevoInventario = await InventarioSede.create({
            producto_id: producto.id,
            sede_id,
            stock
        }, { transaction });

        await transaction.commit();
        return nuevoInventario;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error.message);
    }
}