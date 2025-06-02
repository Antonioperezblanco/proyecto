import Discoteca from '../models/Discoteca.js';
import FiestaPrivada from '../models/FiestaPrivada.js';

export const findDiscotecaById = (id) => Discoteca.findOne({ id: Number(id) });

export const findFiestaPrivadaById = (id) => FiestaPrivada.findOne({ id: Number(id) });



