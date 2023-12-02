import { prismaClient } from "./prismaClient";
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { payload } from "./interfaces";


//Funcão Middleware que checara se existe o usuario requerido no banco de dados
export async function retornaUsuarioExistente(req: Request, res: Response, next: NextFunction) {
    const email = String(req.headers.email);
    const usuarioEncontrado = await prismaClient.usuario.findUnique({
        where: {
            email: email
        }
    })
    if (usuarioEncontrado !== null) {
        req.userExpr = usuarioEncontrado
        next();
    } else {
        res.status(500).json({ error: "Usuario não existe." });
    }
}

//Funcão Middleware que autentica o token
export async function autenticaToken(req: Request, res: Response, next: NextFunction) {
    const autenticaHeader = req.headers.authorization

    if (!autenticaHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const [bearer, token] = autenticaHeader.split(' ');

    try {
        var { id } = verify(token, process.env.CHAVE_SECRETA as string) as payload
        req.autenticado = id


    } catch (error) {
        res.status(400).json("Token Inválido!")
    }
    next();

}
