import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

export const inicioSesion = async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);  // Verifica que los datos se están enviando
        const { nombreUsuario, correo, pass } = req.body;

        if (!(nombreUsuario || correo)) {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios' });
        }

        const usuario = await Usuario.findOne({ $or: [{ nombreUsuario }, { correo }] });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const coincidePass = await bcrypt.compare(pass, usuario.pass);
        if (!coincidePass) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        console.log("Autenticación exitosa, redirigiendo...");  // Verifica que el código pase esta parte

        const usuarioData = {
            nombreUsuario: usuario.nombreUsuario,
            correo: usuario.correo,
            edad: usuario.edad,
            ciudad: usuario.ciudad,
            pass: usuario.pass
        };

        res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso',
            usuario: usuarioData
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};
