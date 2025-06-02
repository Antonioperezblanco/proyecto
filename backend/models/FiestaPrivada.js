import mongoose from 'mongoose';
import Fiesta from './Fiesta.js';

const fiestaPrivadaSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  tuAlcohol: { type: Boolean, default: false },
});

fiestaPrivadaSchema.methods.mostrarInfo = function () {
  const baseInfo = this.__proto__.mostrarInfo.call(this);
  return baseInfo + ` Puedes llevar alcohol: ${this.tuAlcohol ? 'Sí' : 'No'}`;
};


fiestaPrivadaSchema.add(Fiesta.schema.obj);

const FiestaPrivada = mongoose.model('FiestaPrivada', fiestaPrivadaSchema, 'fiestasPrivadas');

export default FiestaPrivada;
