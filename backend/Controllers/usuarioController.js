import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { findByUsername, findByMail, findByUsernameOrMail, findById, saveUser } from '../database/usuariosDB.js';

export const crearUsuario = async (req, res) => {
    try {
        const { nombreUsuario, correo, pass, edad, ciudad, idFiestas, amigos } = req.body;

        const existeUsuario = await findByUsername(nombreUsuario)
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
        }

        const correoExiste = await findByMail(correo)
        if (correoExiste) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
        }

        const salt = await bcrypt.genSalt(10);
        const passEncriptada = await bcrypt.hash(pass, salt);

        const nuevoUsuario = new Usuario({
            nombreUsuario,
            correo,
            pass: passEncriptada,
            edad,
            ciudad,
            idFiestas: idFiestas || [],
            amigos: amigos || []
        });

        await saveUser(nuevoUsuario);
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ mensaje: 'Error creando usuario', error: error.message });
    }
}


export const inicioSesion = async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);  // Verifica que los datos se están enviando
        const { nombreUsuario, correo, pass } = req.body;

        if (!(nombreUsuario || correo)) {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios' });
        }

        const usuario = await findByUsernameOrMail(nombreUsuario, correo);
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const coincidePass = await bcrypt.compare(pass, usuario.pass);
        if (!coincidePass) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        console.log("Autenticación exitosa, redirigiendo...");  // Verifica que el código pase esta parte

        const usuarioData = {
            id: usuario.id,
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

export const editarUsuario = async (req, res) => {
    try {
        console.log(req.body)
        const { id, nombreUsuario, correo, edad, ciudad } = req.body;
        const usuario = await findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Hola usuario' });
        }

        // Verificar si el nombre de usuario ya está en uso por otro usuario
        if (nombreUsuario && nombreUsuario !== usuario.nombreUsuario) {
            const usuarioExistente = await findByUsername(nombreUsuario)
            if (usuarioExistente && usuarioExistente.id !== id) {
                return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            }
        }

        // Verificar si el correo ya está en uso por otro usuario
        if (correo && correo !== usuario.correo) {
            const correoExistente = await findByMail(correo);
            if (correoExistente && correoExistente.id !== id) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
            }
        }

        // Actualizar los datos del usuario
        usuario.nombreUsuario = nombreUsuario;
        usuario.correo = correo;
        usuario.edad = edad;
        usuario.ciudad = ciudad;

        await saveUser(usuario)

        res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error actualizando usuario', error: error.message });
    }
};
