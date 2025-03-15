import Usuario from '../models/Usuario.js';

export const editarUsuario = async (req, res) => {
    
    try {
        const { id, nombreUsuario, correo, edad, ciudad } = req.body;

        const usuario = await Usuario.findOne(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario hola' });
        }

        // Verificar si el nombre de usuario ya está en uso por otro usuario
        if (nombreUsuario && nombreUsuario !== usuario.nombreUsuario) {
            const usuarioExistente = await Usuario.findOne({ nombreUsuario });
            if (usuarioExistente && usuarioExistente._id.toString() !== id) {
                return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            }
        }

        // Verificar si el correo ya está en uso por otro usuario
        if (correo && correo !== usuario.correo) {
            const correoExistente = await Usuario.findOne({ correo });
            if (correoExistente && correoExistente._id.toString() !== id) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
            }
        }

        // Actualizar los datos del usuario
        usuario.nombreUsuario = nombreUsuario;
        usuario.correo = correo;
        usuario.edad = edad;
        usuario.ciudad = ciudad;

        await usuario.save();

        res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error actualizando usuario', error: error.message });
    }
};
