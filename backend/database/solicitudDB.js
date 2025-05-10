import Solicitud from '../models/Solicitud.js'

export const existeSolicitud = async (usuario, amigo) => {
    const solicitud = await Solicitud.findOne({
        $or: [
            { usuario: usuario, amigo: amigo },
            { usuario: amigo, amigo: usuario }
        ]
    });
    return solicitud; 
};
export const createSolicitud = (nombreUsuario, nombreAmigo) => Solicitud.create({
    usuario: nombreUsuario,
    amigo: nombreAmigo
});

export const obtenerSolicitudesRecibidas = (nombreUsuario) => Solicitud.find({ amigo: nombreUsuario });