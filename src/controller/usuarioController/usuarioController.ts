import { prismaClient } from "../../database/prismaClient";
import express, { Request, Response } from 'express';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validaLogin } from "../../validacoes/validaLogin";
import { log } from "console";


const app = express();
app.use(express.json())


//Login
export async function fazerLogin(req: Request, res: Response) {
    const { email, senha } = req.body

    // Validando os dados do prestador
    const validacaoResult = await validaLogin({
        email,
        senha
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    const retornaUsuarioPrestador = await prismaClient.usuario.findUnique({
        where: {
            email: email
        },
    })
    try {
        console.log(retornaUsuarioPrestador);
        
        if (retornaUsuarioPrestador === null) {
            return res.status(404).json({ error: "Prestador não existe." });
        } else {
            const compararSenhas = await compare(senha, retornaUsuarioPrestador.senha)
            if (!compararSenhas) {
                return res.status(401).json({ error: "Senha ou Email incorreto!." });

            }

            const prestadorId = retornaUsuarioPrestador.id

            const token = jwt.sign(
                { id: prestadorId },
                process.env.CHAVE_SECRETA as string,
                { expiresIn: '1d', subject: prestadorId }
            );
            
            const authData = {
                token: token,
                email: email,
                papel: retornaUsuarioPrestador.papel
            }

            return res.status(200).json(authData)
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro ao fazer login do prestador" })
    }

};