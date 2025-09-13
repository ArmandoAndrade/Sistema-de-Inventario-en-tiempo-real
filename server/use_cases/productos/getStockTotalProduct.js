import InventarioSede from "../../models/InventarioSede.js";
import Producto from "../../models/Producto.js";
import { sequelize } from "../../config/db.js";


export const getStockTotalProductUseCase = async() => {
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

    return stockTotal.map((item) => ({
        producto_id: item.producto_id,
        stock_total: item.get('stock_total'),
        nombre: item.producto?.nombre ?? 'N/A',
        referencia: item.producto?.referencia ?? 'N/A',
        categoria: item.producto?.categoria ?? 'N/A',
        descripcion: item.producto?.descripcion ?? 'N/A'
    }));

}