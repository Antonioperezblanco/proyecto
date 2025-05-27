import Discoteca from '../models/Discoteca.js'
import FiestaPrivada from '../models/FiestaPrivada.js'
import { findDiscotecaById, findFiestaPrivadaById } from '../database/fiestaDB.js';
import { findByUsername } from '../database/usuariosDB.js';
import Usuario from '../models/Usuario.js';


export const crearFiesta = async (req, res) => {
 
    try{
        const {tipo, ciudad, localizacion, fecha, hora, vestimenta, musica, precioCombinado, precioCerveza, precioRefresco, nombre, precio, tuAlcohol} = req.body
        console.log("Datos recibidos en req.body:", req.body);

        const precioCombinadoNum = Number(precioCombinado);
        const precioCervezaNum = Number(precioCerveza);
        const precioRefrescoNum = Number(precioRefresco);
        const precioNum = Number(precio);

        if(tipo === 'fiestaPrivada'){
            const nuevaFiestaPrivada = new FiestaPrivada({
                ciudad,
                localizacion,
                fecha,
                hora,
                vestimenta,
                musica,
                precioCombinado: precioCombinadoNum || null,
                precioCerveza: precioCervezaNum || null,
                precioRefresco :precioRefrescoNum || null,
                tuAlcohol,
            });

            console.log("Guardando una Fiesta Privada:", nuevaFiestaPrivada);
            await nuevaFiestaPrivada.save()
            res.json({message: 'Fiesta Privada creada con exito'})
        }else if(tipo === 'discoteca'){
            const nuevaDiscoteca = new Discoteca({
                ciudad,
                localizacion,
                fecha,
                hora,
                vestimenta,
                musica,
                precio,
                precioCombinado: precioCombinadoNum,
                precioCerveza: precioCervezaNum,
                precioRefresco: precioRefrescoNum,
                nombre,
                precio: precioNum,
            });
            console.log("Guardando una discoteca:", nuevaDiscoteca);
            await nuevaDiscoteca.save() 
            res.json({message: 'Discoteca creada con exito'})
        }
    } catch(error){
        console.error('Error al crear la fiesta', error);
        res.status(500).json({message: 'Error al crear la fiesta', error: error.message});
    }
}

export const buscarFiesta = async (req, res) => {
    try{
        console.log(req.body)
        const {fecha, tipo, nombreUsuario} = req.body;

        const usuario = await findByUsername(nombreUsuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const ciudad = usuario.ciudad;

        const fechaISO = `${fecha}T00:00:00.000Z`;
        const fechaInicio = new Date(fechaISO);
        const fechaFin = new Date(fechaISO);
        fechaFin.setUTCHours(23, 59, 59, 999);


        console.log("Fecha de inicio:", fechaInicio);
        console.log("Fecha de fin:", fechaFin);

        // Aquí haces la consulta sin las horas
        let fiestas = [];

        let query = {
            fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            },
            ciudad: { $regex: new RegExp(`^${ciudad}$`, 'i') } 
        };

        if (tipo === "discoteca") {
            fiestas = await Discoteca.find(query);
        } else if (tipo === "fiesta") {
            fiestas = await FiestaPrivada.find(query);
        } else if (tipo === "ambas") {
            const [discotecas, privadas] = await Promise.all([
                Discoteca.find({
                    fecha: {
                        $gte: fechaInicio,
                        $lt: fechaFin
                    }
                }),
                FiestaPrivada.find({
                    fecha: {
                        $gte: fechaInicio,
                        $lt: fechaFin
                    }
                })
            ]);
            fiestas = [...discotecas, ...privadas];
        }

        console.log("Fiestas encontradas:", fiestas);

        res.status(200).json({
            mensaje: "Fiestas encontradas",
            fiestas
        });
    }catch (error){
        console.log("Error al encontrar fiestas: ", error);
        res.status(500).json({mensaje: 'Error al buscar fiestas', error: error});
    }

}
export const unirseFiesta = async (req, res) => {
    const { nombreUsuario, fiesta } = req.body;
    
    try {
        const usuario = await findByUsername(nombreUsuario);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const idNum = Number(fiesta.id);

        if (isNaN(idNum)) {
        return res.status(400).json({ mensaje: "ID de fiesta inválido" });
        }
        
        let fiestaDB;
        
        if (fiesta.nombre) {
        fiestaDB = await findDiscotecaById(idNum);
        } else {
        fiestaDB = await findFiestaPrivadaById(idNum);
        }

        if (!fiestaDB) return res.status(404).json({ mensaje: "Fiesta no encontrada" });

        for (const idFiesta of usuario.idFiestas) {
            let fiestaExistente = await findDiscotecaById(idFiesta);
            if (!fiestaExistente){
                fiestaExistente = await findFiestaPrivadaById(idFiesta);
            }

            if (fiestaExistente){
                if (fiestaExistente.localizacion === fiestaDB.localizacion){
                    return res.status(400).json({ mensaje: "Ya estas unido a esta fiesta" })
                }
            }

        }

        fiestaDB.contador += 1;
        await fiestaDB.save();

        await Usuario.updateOne(
            { nombreUsuario },
            { $addToSet: { idFiestas: fiesta.id } }
        );

        res.status(200).json({ mensaje: 'Te has unido correctamente a la fiesta' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al unirse a la fiesta' });
    }
}
