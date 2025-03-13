import { z, ZodError } from 'zod';
import { usuarioPrestador, usuarioPrestadorAtualizacao, usuarioPrestadorAtualizaDadosSensiveis } from '../interfaces/interfacesPrestador';
import { type } from 'os';

function validaCnpj(cnpj: string): boolean {
  // Lógica de validação do CNPJ
  const padraoCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
  return padraoCNPJ.test(cnpj);
}

const validaTelefone = (telefone: string): boolean => {
  // Expressão regular para validar um número de telefone no formato brasileiro (XX) XXXX-XXXX
  const padraoTelefone = /^\(\d{2}\) \d{4}-\d{4}$/;
  return padraoTelefone.test(telefone);
};

//Validando dados do prestador na hora da sua criação
export function validaPrestadorCriacao(prestador: usuarioPrestador) {
  const schema = z.object({
    nome: z.string({ required_error: 'Nome é obrigatório' }).trim()
      .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string({ required_error: 'Email é obrigatório' }).trim()
      .email('E-mail inválido'),
    senha: z.string({ required_error: 'Senha é obrigatória' }).trim()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    telefone: z.string({ required_error: 'Telefone é obrigatório' }).refine((value) => validaTelefone(value), {
      message: 'Telefone incorreto: digite no padrão (XX) XXXX-XXXX.',
    }),
    cnpj: z.string({ required_error: 'CNPJ é obrigatório' }).trim()
      .refine((value) => validaCnpj(value), { message: 'CNPJ incorreto: digite no padrão XX.XXX.XXX/XXXX-XX.' }),
    horarioDisponibilidade: z.string({ required_error: 'Horário de disponibilidade é obrigatório' }),
    latitude: z.number({ required_error: 'Latitude é obrigatório' }),
        longitude: z.number({ required_error: 'Longitude é obrigatório' }),
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}

////Validando dados do prestador na hora da sua atualização
export function validaPrestadorAtualizacao(prestador: usuarioPrestadorAtualizacao) {
  const schema = z.object({
    nome: z.string({ required_error: 'Nome é obrigatório' }).trim()
      .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    telefone: z.string({ required_error: 'Telefone é obrigatório' }).refine((value) => validaTelefone(value), {
      message: 'Telefone incorreto: digite no padrão (XX) XXXX-XXXX.',
    }),
    horarioDisponibilidade: z.string({ required_error: 'Horário de disponibilidade é obrigatório' }),
    latitude: z.number({ required_error: 'Latitude é obrigatório' }),
    longitude: z.number({ required_error: 'Longitude é obrigatório' }),
    
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}


////Validando dados do prestador no login
export function validaPrestadorLogin(prestador: usuarioPrestadorAtualizaDadosSensiveis) {
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