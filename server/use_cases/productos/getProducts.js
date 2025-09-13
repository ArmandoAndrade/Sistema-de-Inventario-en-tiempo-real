import {InventarioSede} from "../../models/index.js";
import {Sede} from "../../models/index.js";
import {Producto} from "../../models/index.js";
import { sequelize } from "../../config/db.js";


export const getProductsUseCase = async (sedeUsuario) => {

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

    return productos;

}


