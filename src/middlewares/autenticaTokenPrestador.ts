import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { payload } from '../interfaces/interfacesPrestador';

// Middleware para autenticar o token do prestador
export async function autenticaTokenPrestador(req: Request, res: Response, next: NextFunction) {
    const autenticaHeader = req.headers.authorization;

    if (!autenticaHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const [bearer, token] = autenticaHeader.split(' ');

    if (bearer !== 'Bearer') {
        return res.status(401).json({ error: 'Token de autenticação inválido' });
    }

    try {
        // Verifica o token
        const { id } = verify(token, process.env.CHAVE_SECRETA as string) as payload;

        // Verifica se o ID do token corresponde ao ID do prestador
        const idUsuarioPrestador = req.userExpr?.id; // Garantir que req.userExpr existe e tem um ID

        if (id !== idUsuarioPrestador) {
            return res.status(401).json({ error: 'Não autorizado: O token fornecido pertence a um usuário diferente.' });
        }

        // Se a autenticação for bem-sucedida, adiciona o ID do usuário autenticado à requisição
        req.autenticado = id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido!' });
    }
}
