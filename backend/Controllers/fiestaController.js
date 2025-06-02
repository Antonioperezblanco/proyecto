import Discoteca from '../models/Discoteca.js'
import FiestaPrivada from '../models/FiestaPrivada.js'
import { findDiscotecaById, findFiestaPrivadaById } from '../database/fiestaDB.js';
import { findByUsername, saveUser } from '../database/usuariosDB.js';
import Usuario from '../models/Usuario.js';
import Counter from '../models/Counter.js';

export const crearFiesta = async (req, res) => {
 
    try{
        const {tipo, ciudad, localizacion, fecha, hora, vestimenta, musica, precioCombinado, precioCerveza, precioRefresco, nombre, precio, tuAlcohol} = req.body
        console.log("Datos recibidos en req.body:", req.body);

        const precioCombinadoNum = Number(precioCombinado);
        const precioCervezaNum = Number(precioCerveza);
        const precioRefrescoNum = Number(precioRefresco);
        const precioNum = Number(precio);

        const nuevoId = await getNextFiestaId();

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
                id: nuevoId,
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
                id: nuevoId,
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

        if (usuario.idFiestas.includes(idNum)) {
            return res.status(400).json({ mensaje: "Ya estás apuntado a esta fiesta" });
        }

        let fiestaDB;
        if (fiesta.nombre) {
            fiestaDB = await findDiscotecaById(idNum);
        } else {
            fiestaDB = await findFiestaPrivadaById(idNum);
        }

        if (!fiestaDB) return res.status(404).json({ mensaje: "Fiesta no encontrada" });
        
        fiestaDB.contador = (fiestaDB.contador || 0) + 1;
        await fiestaDB.save();

        usuario.idFiestas.push(idNum);
        await usuario.save();

        res.status(200).json({ mensaje: 'Te has unido correctamente a la fiesta' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al unirse a la fiesta' });
    }
}


export const cambiarCiudad = async (req, res) => {
    try {
        console.log(req.body);
        const { fecha, tipo, nombreUsuario, ciudad } = req.body;

        const usuario = await findByUsername(nombreUsuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        let nuevaCiudad;

        if (ciudad.toLowerCase() === 'madrid') {
            nuevaCiudad = 'Barcelona';
        } else if (ciudad.toLowerCase() === 'barcelona') {
            nuevaCiudad = 'Madrid';
        } else {
            return res.status(400).json({ mensaje: 'Ciudad no soportada' });
        }

        const fechaISO = `${fecha}T00:00:00.000Z`;
        const fechaInicio = new Date(fechaISO);
        const fechaFin = new Date(fechaISO);
        fechaFin.setUTCHours(23, 59, 59, 999);

        console.log("Fecha de inicio:", fechaInicio);
        console.log("Fecha de fin:", fechaFin);
        console.log("Ciudad buscada:", ciudad);

        let fiestas = [];

        const query = {
            fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            },
            ciudad: { $regex: new RegExp(`^${nuevaCiudad}$`, 'i') }
        };

        if (tipo === "discoteca") {
            fiestas = await Discoteca.find(query);
        } else if (tipo === "fiesta") {
            fiestas = await FiestaPrivada.find(query);
        } else if (tipo === "ambas") {
            const [discotecas, privadas] = await Promise.all([
                Discoteca.find(query),
                FiestaPrivada.find(query)
            ]);
            fiestas = [...discotecas, ...privadas];
        }

        console.log("Fiestas encontradas:", fiestas);

        res.status(200).json({
            mensaje: "Fiestas encontradas",
            fiestas,
            ciudadCambiada: nuevaCiudad
        });
    } catch (error) {
        console.log("Error al encontrar fiestas: ", error);
        res.status(500).json({ mensaje: 'Error al buscar fiestas', error: error });
    }
}

export const getNextFiestaId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'fiesta' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

export const verFiestas = async (req, res) => {
    const { nombreUsuario, desde } = req.body;

    try {
        const usuario = await findByUsername(nombreUsuario);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const idsFiestas = usuario.idFiestas || []; 
        const desdeDate = new Date(desde);

        const [discotecas, privadas] = await Promise.all([
            Discoteca.find({
                id: { $in: idsFiestas },
                fecha: { $gte: desdeDate }
            }),
            FiestaPrivada.find({
                id: { $in: idsFiestas },
                fecha: { $gte: desdeDate }
            })
        ]);

        const fiestas = [...discotecas, ...privadas];

        res.json({ fiestas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};

export const desapuntarse = async (req, res) => {

     const { nombreUsuario, idFiesta } = req.body;

  try {
    const usuario = await findByUsername(nombreUsuario);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    usuario.idFiestas = usuario.idFiestas.filter(id => id !== idFiesta);

    let fiesta = await findDiscotecaById(idFiesta);
    if (!fiesta){
        fiesta = await findFiestaPrivadaById(idFiesta)
    }
    fiesta.contador -= 1;
    await saveUser(usuario);
    await fiesta.save();
    res.json({ mensaje: "Desapuntado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
