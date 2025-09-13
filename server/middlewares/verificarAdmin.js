export const verificarAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: "Acceso denegado: solo el administrador puede realizar esta acción." });
    }
    next();
  };
  