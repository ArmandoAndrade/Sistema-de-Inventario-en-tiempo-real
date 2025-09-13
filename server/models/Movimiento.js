import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Movimiento = sequelize.define('movimiento', {
    id: { 
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    producto_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false },
    sede_origen_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true },
    sede_destino_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true },
    cantidad: { 
        type: DataTypes.INTEGER, 
        allowNull: false },
    tipo: { 
        type: DataTypes.ENUM('entrada', 'salida', 'traslado'), allowNull: false },
    usuario_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false },
    fecha: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW },
    observaciones: { 
        type: DataTypes.TEXT }
  }
);


export default Movimiento;