import mongoose from 'mongoose';


const fiestaSchema = new mongoose.Schema({
    ciudad: { type: String, required: true },
    localizacion: { type: String, required: true },
    hora: { type: String, required: true },
    vestimenta: { type: String, required: true },
    precioCombinado: { type: Number },
    precioCerveza: { type: Number },
    precioRefresco: { type: Number },
    musica: { type: String, required: true },
    fecha: { type: Date, required: true },
    contador: { type: Number, default: 0 },
}, {timestamps: true}); 



fiestaSchema.methods.mostrarInfo = function () {
    return `
        Ciudad: ${this.ciudad},
        Localización: ${this.localizacion},
        Hora: ${this.hora},
        Vestimenta: ${this.vestimenta},
        Precio combinado: ${this.precioCombinado} euros,
        Precio cerveza: ${this.precioCerveza} euros,
        Precio refresco: ${this.precioRefresco} euros,
        Música: ${this.musica},
        Fecha: ${this.fecha},
        ID: ${this.id},
        Contador: ${this.contador}
    `;
};

fiestaSchema.methods.añadirPersona = function () {
    this.contador += 1;
    return this.contador;
};

const Fiesta = mongoose.model('Fiesta', fiestaSchema);
export default Fiesta;