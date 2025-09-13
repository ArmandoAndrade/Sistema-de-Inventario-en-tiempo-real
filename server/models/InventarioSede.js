import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const InventarioSede = sequelize.define('inventario_sede', {
    producto_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true 
    },
    sede_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true 
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true,
}
);


export default InventarioSede;
