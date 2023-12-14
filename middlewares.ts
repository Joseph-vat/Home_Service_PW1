import { prismaClient } from "./prismaClient";
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { payload } from "./interfaces";


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
        res.status(404).json({ error: "Usuário não existe." });
    }
}

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
