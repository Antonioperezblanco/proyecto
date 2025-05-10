import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
    userId: { 
        type: Number,  
        required: true, 
        ref: 'Usuario'
    },
    token: { 
        type: String, 
        required: true,
        unique: true,
        validate: {
            validator: v => /^[a-f0-9]{64}$/.test(v),
            message: props => `${props.value} no es un token válido!`
        }
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: '1h'
    }
})

export default mongoose.model('Token', tokenSchema);