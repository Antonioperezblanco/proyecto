import Discoteca from '../models/Discoteca.js';
import FiestaPrivada from '../models/FiestaPrivada.js';

export const findDiscotecaById = (id) => Discoteca.findOne({ idDiscoteca: Number(id) });

export const findFiestaPrivadaById = (id) => FiestaPrivada.findOne({ idFiestaPrivada: Number(id) });



