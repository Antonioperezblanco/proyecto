import mongoose from 'mongoose';
import  Fiesta from './Fiesta.js' 
import mongooseSequence from 'mongoose-sequence';

const fiestaPrivadaSchema = new mongoose.Schema({
    tuAlcohol: { type: Boolean, default: false },
    idFiestaPrivada: { type: Number },
});
fiestaPrivadaSchema.plugin(mongooseSequence(mongoose), {inc_field: 'idFiestaPrivada'});

fiestaPrivadaSchema.methods.mostrarInfo = function () {
    const baseInfo = this.__proto__.mostrarInfo.call(this); 
    return baseInfo + ` Puedes llevar alcohol: ${this.tuAlcohol ? 'Sí' : 'No'}`;
};

fiestaPrivadaSchema.add(Fiesta.schema.obj);

const FiestaPrivada = mongoose.model('FiestaPrivada', fiestaPrivadaSchema, 'fiestasPrivadas');

export default FiestaPrivada