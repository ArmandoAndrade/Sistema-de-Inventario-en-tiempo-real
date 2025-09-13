import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'usuario' // otros valores: 'admin'
      },
      sede_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'sedes',
          key: 'id'
        }
      }
}, {
    timestamps: true,
    paranoid: true, // Para borrado lógico

    hooks: {
        beforeCreate: async (usuario) => {
            if(usuario.changed("contraseña")){
                const salt = await bcrypt.genSalt(10);
                usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
            }
        }
    }
}
);



export default Usuario;