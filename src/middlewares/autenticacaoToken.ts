import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { payload } from '../interfaces/interfaces';



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
        res.status(401).json("Token Inválido!")
    }
    next();

}