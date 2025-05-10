import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
     usuario: { type: String, required: true },
     amigo: { type: String, required: true },
     estado: { type: String, enum: ['pendiente', 'aceptada', 'rechazada'], default: 'pendiente'},
     fecha: { type: Date, default: Date.now } 
});



export default mongoose.model('Solicitud', solicitudSchema);