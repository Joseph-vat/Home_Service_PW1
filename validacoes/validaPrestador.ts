import { z, ZodError } from 'zod';
import { usuarioPrestador, usuarioPrestadorAtualizacao, usuarioPrestadorAtualizaDadosSensiveis } from '../interfaces';
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

const validaHorarioDisponibilidade = (horario: string): boolean => {
  // Expressão regular para validar um horário no formato "8h às 18h"
  const padraoHorario = /^\d{1,2}h\s*às\s*\d{1,2}h$/;
  return padraoHorario.test(horario);
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
    horarioDisponibilidade: z.string({ required_error: 'Horário de disponibilidade é obrigatório' })
      .refine((value) => validaHorarioDisponibilidade(value), {
        message: 'Horário de disponibilidade incorreto: digite no padrão "8h às 18h".',
      }),
    foto: z.string({ required_error: 'Campo foto é obrigatório' }),
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}

////Validando dados do prestador na hora da sua atualização
export function validaPrestadorAtulizacao(prestador: usuarioPrestadorAtualizacao) {
  const schema = z.object({
    nome: z.string({ required_error: 'Nome é obrigatório' }).trim()
      .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    telefone: z.string({ required_error: 'Telefone é obrigatório' }).refine((value) => validaTelefone(value), {
      message: 'Telefone incorreto: digite no padrão (XX) XXXX-XXXX.',
    }),
    cnpj: z.string({ required_error: 'CNPJ é obrigatório' }).trim()
      .refine((value) => validaCnpj(value), { message: 'CNPJ incorreto: digite no padrão XX.XXX.XXX/XXXX-XX.' }),
    horarioDisponibilidade: z.string({ required_error: 'Horário de disponibilidade é obrigatório' })
      .refine((value) => validaHorarioDisponibilidade(value), {
        message: 'Horário de disponibilidade incorreto: digite no padrão "8h às 18h".',
      }),
    foto: z.string({ required_error: 'Campo foto é obrigatório' }),
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}

////Validando dados do prestador na atualização de dados sensiveis
export function validaPrestadorSeguranca(prestador: usuarioPrestadorAtualizaDadosSensiveis) {
  const schema = z.object({
    email: z.string({ required_error: 'Email é obrigatório' }).trim()
    .email('E-mail inválido'),
  senha: z.string({ required_error: 'Senha é obrigatória' }).trim()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
  })

  const result = schema.safeParse(prestador);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return errors;
  }
  return null; // Retorna null se a validação passar
}