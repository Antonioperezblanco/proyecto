import Solicitud from '../models/Solicitud.js';
import Usuario from '../models/Usuario.js'

export const findByUsername = (nombreUsuario) => Usuario.findOne({ nombreUsuario });

export const findByMail = (correo) => Usuario.findOne({ correo });

export const findByUsernameOrMail = (nombreUsuario, correo) => Usuario.findOne({ $or: [{ nombreUsuario }, { correo }] });

export const findById = (id) => Usuario.findOne({ id: Number(id) });

export const saveUser = (user) => user.save();

export const existeAmigo = (usuario, amigoId) => usuario.amigos.includes(amigoId);

export const addAmigo = async (usuarioId, amigoId) => {
    const usuario = await findById(usuarioId);
    if (usuario && !usuario.amigos.includes(amigoId)){
        usuario.amigos.push(amigoId);
        await usuario.save();
    }
}

export const deleteSolicitud = (usuario, receptor) => Solicitud.deleteOne({ usuario, amigo: receptor});