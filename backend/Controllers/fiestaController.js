import Fiesta from '../models/Fiesta.js'
import Discoteca from '../models/Discoteca.js'
import FiestaPrivada from '../models/FiestaPrivada.js'

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
        const {fecha, tipo} = req.body;

        const fechaInicio = new Date(fecha);
        fechaInicio.setUTCHours(0,0,0,0);

        const fechaFin = new Date(fecha);
        fechaFin.setUTCHours(0,0,0,0);

        let filtro = { fecha: { $gte: fechaInicio, $lt: fechaFin  } };

        if (tipo !== "ambas"){
            filtro.__t === "FiestaPrivada" ? "FiestaPrivada" : "Discoteca";
        }
        const fiestas = await Fiesta.find(filtro);

        console.log("Fiestas: ", fiestas);

        res.status(200).json({
            mensaje: "Fiestas encontradas",
            fiestas
        });
    }catch (error){
        console.log("Error al encontrar fiestas: ", error);
        res.status(500).json({mensaje: 'Error al buscar fiestas', error: error});
    }

}