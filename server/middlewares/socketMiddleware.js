import { io } from "../server";
import { verificarToken } from "./auth.js";

io.use((socket, next) => {

    try {
        const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Token de autenticación requerido"));
    }
    verificarToken(token)
        .then(decoded => {
            socket.user = decoded;
            next();
        })
        .catch(err => {
            next(new Error("Token inválido"));
        });
        
    } catch (error) {
        next(new Error("Error al verificar el token")); 
    }



    //     return next(new Error("Token inválido"));
    //   }
    //   socket.user = decoded; // Guarda la información del usuario en el socket
    //   next();
    // });
    
    // Simulación de verificación de token
    if (token === "valid-token") {
        socket.user = { id: "123", sede_id: "456" }; // Simula un usuario autenticado
        return next();
    } else {
        return next(new Error("Token inválido"));
    }
});