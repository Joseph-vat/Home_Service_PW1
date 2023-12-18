import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../database/prismaClient';


//Funcão Middleware que checara se usuario do tipo prestador requerido existe no banco de dados
export async function retornaPrestadorExistente(req: Request, res: Response, next: NextFunction) {
    const email = String(req.headers.email);
    const prestadorEncontrado = await prismaClient.usuario.findUnique({
        where: {
            email: email
        }
    })
    if (prestadorEncontrado !== null) {
        req.userExpr = prestadorEncontrado
        next();
    } else {
        res.status(404).json({ error: "Prestador não existe." });
    }
}