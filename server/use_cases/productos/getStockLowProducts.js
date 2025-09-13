import InventarioSede from "../../models/InventarioSede.js";
import Sede from "../../models/Sede.js";
import Producto from "../../models/Producto.js";
import { Op } from "sequelize";

export const getStockLowProductsUseCase = async(sedeId, threshold) => {
    if(!sedeId || isNaN(threshold)){
        throw new Error("Parámetros inválidos.");
    }

    const productosBajoStock = await InventarioSede.findAll({
        where: {
            sede_id: sedeId,
            stock: {
                [Op.lt]:threshold,
            },
        },
        order: [["stock", "ASC"]],
        include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "referencia"],
            },
            {
              model: Sede,
              as: "sede",
              attributes: ["nombre"],
            },
          ]
        
    });


  return productosBajoStock;
}

