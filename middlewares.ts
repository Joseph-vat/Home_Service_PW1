import { prismaClient } from "./prismaClient";
import { Request, Response, NextFunction } from 'express';

//Funcão Middleware que checara se existe o prestador requerido no banco de dados
export async function retornaPrestadorExistente(req: Request, res: Response, next: NextFunction) {
    const email = String(req.headers.email);
    const prestadorEncontrado = await prismaClient.prestadorServico.findUnique({
        where: {
            email: email
        }
    })
    if (prestadorEncontrado !== null) {
        req.userExpr = prestadorEncontrado
        next();
    } else {
        res.status(500).json({ error: "Prestador não existe." });
    }
}

//Funcão Middleware que autentica o token
export async function autenticaToken(req: Request, res: Response, next: NextFunction) {
    
}
