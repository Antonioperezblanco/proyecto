import Usuario from '../models/Usuario.js'

export const findByUsername = (nombreUsuario) => Usuario.findOne({ nombreUsuario });

export const findByMail = (correo) => Usuario.findOne({ correo });

export const findByUsernameOrMail = (nombreUsuario, correo) => Usuario.findOne({ $or: [{ nombreUsuario }, { correo }] });

export const findById = (id) => Usuario.findOne({ id });

export const saveUser = (user) => user.save();
