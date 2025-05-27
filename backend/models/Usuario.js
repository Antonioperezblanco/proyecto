import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';


const usuarioSchema = new mongoose.Schema({
    id: { type: Number }, 
    nombreUsuario: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    edad: { type: Number, required: true },
    ciudad: { type: String, required: true },
    idFiestas: [{ type: Number, default: null }],
    amigos: [{ type: Number, ref: 'Usuario' }]
});

usuarioSchema.plugin(mongooseSequence(mongoose), { inc_field: 'id' });

export default mongoose.model('Usuario', usuarioSchema);