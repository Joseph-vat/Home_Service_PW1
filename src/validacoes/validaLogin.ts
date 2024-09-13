import { z, ZodError } from 'zod';
import { usuarioPrestador, usuarioPrestadorAtualizacao, usuarioPrestadorAtualizaDadosSensiveis } from '../interfaces/interfacesPrestador';
import { type } from 'os';

////Validando dados do usuario no login
export function validaLogin(prestador: usuarioPrestadorAtualizaDadosSensiveis) {
  const schema = z.object({
    email: z.string({ required_error: 'Email é obrigatório' }).trim()
      .email('E-mail inválido'),
    senha: z.string({ required_error: 'Senha é obrigatória' }).trim()
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}