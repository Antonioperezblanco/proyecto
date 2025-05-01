import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mostrar el formulario al acceder al enlace del correo
router.get('/pass/recuperar/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/views/usuarios/cambiarPass.html'));
  });

import { deleteToken, findToken, createToken } from '../database/tokenDB.js';
import { findById, findByMail, saveUser } from '../database/usuariosDB.js';

export const solicitarRecuperacion = async (req, res) => {
    const { correo } = req.body;
    const usuario = await findByMail(correo);
    if(!usuario){
        return res.status(404).json({ mensaje: 'Correo no encontrado' });
    }
    const token = crypto.randomBytes(32).toString('hex') 
    await createToken(usuario.id, token);

    const link = `http://127.0.0.1:3000/frontend/pass/recuperar/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'buscasfiestass@gmail.com',
            pass: 'otlp jjjh tdhr iqur'
        }
    })

    await transporter.sendMail({
        from: 'buscasfiestass@gmail.com',
        to: correo,
        subject: 'Recuperar contraseña',
        html: `<p> Haz click en el siguiente enlace para restablecer la contraseña: </p> <a href="${link}">${link}</a>`
    });

    res.json({ mensaje: 'Correo enviado' });

}

export const restablecerPass = async (req, res) => {
    const { token } = req.params;
    const { nuevaPass } = req.body;

    const tokenDoc = await findToken({ token })

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

    res.json({ mensaje: 'Contraseña actualizada' })
};