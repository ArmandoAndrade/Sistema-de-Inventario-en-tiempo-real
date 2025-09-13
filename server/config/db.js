
//config de base de datos
import {Sequelize} from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_NAME, //nombre db
    process.env.DB_USER,// usuario
    process.env.DB_PASSWORD,//contraseña

    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, //para no mostrar logs de sql en consola
    }
);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);

//prueba de conexión
const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL conectado');
    } catch (error) {
      console.error('❌ Error de conexión:', error.message);
    }
  };

export  {sequelize, testConnection};