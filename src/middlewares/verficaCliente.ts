import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../database/prismaClient';



//Funcão Middleware que checara se existe o usuario do tipo cliente requerido no banco de dados
export async function retornaClienteExistente(req: Request, res: Response, next: NextFunction) {
    const email = String(req.headers.email);
    const clienteEncontrado = await prismaClient.usuario.findUnique({
        where: {
            email: email
        }
    })
    if (clienteEncontrado !== null) {
        req.userExprCliente = clienteEncontrado
        next();
    } else {
        res.status(404).json({ error: "Usuario não existe." });
    }
}