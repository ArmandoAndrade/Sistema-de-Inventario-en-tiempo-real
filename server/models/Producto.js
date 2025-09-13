//modelo de la tabla producto

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Producto = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      referencia: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      categoria: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    }, {
      timestamps: true,
      paranoid: true
    }
);



export default Producto;