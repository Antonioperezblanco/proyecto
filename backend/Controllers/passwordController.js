import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { deleteToken, findToken, createToken } from '../database/tokenDB.js';
import { findById, findByMail, saveUser } from '../database/usuariosDB.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mostrarFormulario = (req, res) => {
    const proyectoRoot = process.cwd();
    const rutaAbsoluta = path.join(proyectoRoot, 'frontend', 'views', 'usuarios', 'cambiarPass.html');
    
    if (!fs.existsSync(rutaAbsoluta)) {
        console.error('ERROR: Archivo no encontrado en', rutaAbsoluta);
        return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    res.sendFile(rutaAbsoluta);
};

export const solicitarRecuperacion = async (req, res) => {
    try {
        const { correo } = req.body;
        
        if (!correo) {
            return res.status(400).json({ error: 'El correo es requerido' });
        }

        const usuario = await findByMail(correo);
        if (!usuario) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        // Generar token único
        const token = crypto.randomBytes(32).toString('hex')
        await createToken(usuario.id, token);

        // Crear enlace de recuperación
        const link = `http://127.0.0.1:3000/pass/restablecer/${token}`;

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'buscasfiestass@gmail.com',
                pass: 'otlp jjjh tdhr iqur'
            }
        });

        // Enviar correo
        await transporter.sendMail({
            from: 'buscasfiestass@gmail.com',
            to: correo,
            subject: 'Recuperar contraseña',
            html: `
                <h2>Recuperación de contraseña</h2>
                <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${link}">Restablecer contraseña</a>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
            `
        });

        res.json({ mensaje: 'Correo de recuperación enviado' });
    } catch (error) {
        console.error('Error en solicitar-recuperacion:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};


export const restablecerPass = async (req, res) => {
    const { token } = req.params;
    const { nuevaPass } = req.body;

    const tokenDoc = await findToken(token)

    if (!tokenDoc){
        return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }

    const usuario = await findById(tokenDoc.userId);
    if (!usuario){
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.pass = await bcrypt.hash(nuevaPass, 10);
    await saveUser(usuario);
    await deleteToken(tokenDoc);

    res.json({ mensaje: 'Contraseña actualizada' });
};