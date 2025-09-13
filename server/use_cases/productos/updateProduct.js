import InventarioSede from "../../models/InventarioSede.js";
import Producto from "../../models/Producto.js";
import { sequelize } from "../../config/db.js";


export const updateProductUseCase = async(id ,sede_id, actualizarData, userRole = 'user') => {
    const transaction = await sequelize.transaction();

    try {
        //verificar que el producto existe
        const producto = await Producto.findByPk(id, { transaction });
        if (!producto) {
            throw new Error("Producto no encontrado");
        }

        //actualizar campos
        const { id: _id, createdAt, updatedAt, stock, ...camposActualizables } = actualizarData;
        await producto.update(camposActualizables, { transaction });

            
        // Buscar el registro en InventarioSede para la sede especificada
        const inventario = await InventarioSede.findOne({
            where: { producto_id: id, sede_id },
            transaction
        });

        //verificar permisos usuarios normales
        if (userRole !== 'admin' && !inventario) {
            throw new Error("No tiene permiso para modificar este producto");
        }


        
      

        //actualizar stock en la sede
        if (typeof stock === 'number') {
            
             await InventarioSede.update(
                { stock },
                { 
                    where: { producto_id: id, sede_id },
                    transaction 
                }
            );
        }

        await transaction.commit();
        return producto;
    } catch (error) {
        if (transaction.finished !== 'rollback') {
            await transaction.rollback();
        }
        throw new Error(error.message);
    }
}