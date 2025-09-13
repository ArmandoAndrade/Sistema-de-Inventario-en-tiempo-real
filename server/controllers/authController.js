import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';


//Iniciar Sesión
export const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    console.log("Password enviado:", contraseña);
    console.log("Password en BD:", usuario.contraseña);

    const passwordValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign( //Firma los datos del usuario y genera un token
      {
        id: usuario.id,
        sede_id: usuario.sede_id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        sede_id: usuario.sede_id,
        rol: usuario.rol
      }
    })
  } catch (error) {
    console.error(error);  // Imprime el error completo en consola
    res.status(500).json({ error: "Error en el servidor" });
  }
}

