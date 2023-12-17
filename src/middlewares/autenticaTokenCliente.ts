import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { payload } from '../interfaces/interfacesPrestador';


//Funcão Middleware que autentica o token cliente
export async function autenticaTokenCliente(req: Request, res: Response, next: NextFunction) {
    const autenticaHeader = req.headers.authorization    

    if (!autenticaHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const [bearer, token] = autenticaHeader.split(' ');

    try {
        const idUsuarioCliente = req.userExprCliente.id
        var { id } = verify(token, process.env.CHAVE_SECRETA as string) as payload

        //Verifica se o id contindo no payload(referente ao token) e igual ao id referente ao email passado do Headers
        if(id === idUsuarioCliente){
            req.autenticado = id
        }
        else{
           return res.status(401).json("Não autorizado: O token fornecido pertence a um usuário diferente. Faça login com suas próprias credenciais para acessar este recurso.") 
        }

    }catch (error) {
        return res.status(401).json("Token Inválido!")
    }
    next();

}