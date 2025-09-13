import Producto from "../../models/Producto.js";
import InventarioSede from "../../models/InventarioSede.js";
import Sede from "../../models/Sede.js";
import { Op } from "sequelize";

export const getProductsTransferUseCase = async ({ search, sedeId }) => {

  try {
    const productos = await InventarioSede.findAll({
      where: { sede_id: sedeId },
      include: [
        {
          model: Producto,
          as: "producto",
          where: {
            nombre: {
              [Op.iLike]: `%${search}%`
            }
          },
          required: true
        },
        {
          model: Sede,
          as: "sede"
        }
      ],
      limit: 10
    });
    if (!productos || productos.length === 0) {
            throw new Error("No se encontraron productos");
        }
    return productos;
  } catch (error) {
    console.error("Error en getProductsTransferUseCase:", error);
    throw new Error("Error al buscar productos para traslado.");
  }

}