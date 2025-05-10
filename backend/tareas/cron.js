import Fiesta from '../models/Fiesta.js';

export async function eliminarFiestas() {
    const hoy = new Date();
    try {
        const result = await Fiesta.deleteMany({ fecha: { $lt: hoy } });
        console.log(`Fiestas eliminadas: ${result.deletedCount}`);
    } catch (err) {
        console.error("Error al eliminar fiestas expiradas:", err);
    }
}
