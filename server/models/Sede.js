import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Sede = sequelize.define('sede', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      direccion: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      timestamps: true
    }
);



export default Sede;