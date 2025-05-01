import mongoose from 'mongoose';
import Fiesta from './Fiesta.js' 
import mongooseSequence from 'mongoose-sequence';


// Esquema extendido: Discoteca
const discotecaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },  
    precio: { type: Number, required: true }, 
    idDiscoteca: { type: Number },
});
discotecaSchema.plugin(mongooseSequence(mongoose), {inc_field: 'idDiscoteca'});

discotecaSchema.methods.mostrarInfo = function () {
    const baseInfo = this.__proto__.mostrarInfo.call(this);  
    return baseInfo + `
        Nombre: ${this.nombre},
        Precio: ${this.precio} €
    `;
};
discotecaSchema.add(Fiesta.schema.obj);

const Discoteca = mongoose.model('Discoteca', discotecaSchema, 'discotecas')
export default Discoteca;