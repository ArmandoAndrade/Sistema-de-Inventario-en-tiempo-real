import jwt from "jsonwebtoken";
import Usuario  from "../models/Usuario.js";

export const verificarToken = async (req, res, next) => {
    const authHeader = req.headers.authorization; //Lee el token JWT desde el header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // clave secreta del .env, Lee el token, lo desencripta, y devuelve el  objeto que firmado
        req.user = decoded; // Asigna los datos desencriptados al objeto req.user

       // const usuario = await Usuario.findByPk(decoded.id); //Busca al usuario en la base de datos

        /* if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        } */

        /*req.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            sede_id: usuario.sede_id,
            rol: usuario.rol,
        };*/

        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}
