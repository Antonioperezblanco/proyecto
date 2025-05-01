import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: { type: Number, required: true, ref: 'Usuario'},
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, expires: 3600 }
})

export default mongoose.model('Token', tokenSchema);