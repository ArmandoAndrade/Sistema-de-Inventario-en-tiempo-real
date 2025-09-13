import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const PeticionTraslado = sequelize.define('peticion_traslado', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },
  producto_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false },
  sede_origen_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false },
  sede_destino_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false },
  cantidad: { 
    type: DataTypes.INTEGER, 
    allowNull: false },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'), 
    defaultValue: 'pendiente' 
  },
  fecha_solicitud: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW },
  fecha_respuesta: { 
    type: DataTypes.DATE },
  usuario_solicita_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true },
  usuario_responde_id: { 
    type: DataTypes.INTEGER },
  observaciones: { type: DataTypes.TEXT }
});

export default PeticionTraslado;
