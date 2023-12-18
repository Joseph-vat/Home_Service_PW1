import { z, ZodError } from 'zod';
import { usuarioCliente, usuarioClienteAtualizacao, usuarioClienteAtualizacaoDadosSensiveis } from '../interfaces/interfacesCliente'; 
import { type } from 'os';

const validaTelefone = (telefone: string): boolean => {
    // Expressão regular para validar um número de telefone no formato brasileiro (XX) XXXX-XXXX
    const padraoTelefone = /^\(\d{2}\) \d{4}-\d{4}$/;
    return padraoTelefone.test(telefone);
};

const validaCpf = (cpf: string): boolean => {
    // Expressão regular para validar um número de telefone no formato brasileiro (XX) XXXX-XXXX
    const padraoCpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return padraoCpf.test(cpf);
};

export const validaClienteCriacao = (cliente: usuarioCliente) => {
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
        cpf: z.string({ required_error: 'CPF é obrigatório' }).trim()
            .refine((value) => validaCpf(value), { message: 'CPF incorreto: digite no padrão XXX.XXX.XXX-XX.' }),
        endereco: z.string({ required_error: 'Endereço é obrigatório' }).trim()
            .min(3, 'O endereço deve ter no mínimo 3 caracteres'),
    })

    const result = schema.safeParse(cliente);

    if (!result.success) {
        const errors = result.error.errors.map((err: any) => err.message);
        return errors;
    }
    return null; // Retorna null se a validação passar
}

//validando dados do cliente na hora da sua atualização
export function validaClienteAtualizacao(cliente: usuarioClienteAtualizacao) {
    const schema = z.object({
        nome: z.string({ required_error: 'Nome é obrigatório' }).trim()
            .min(3, 'O nome deve ter no mínimo 3 caracteres'),
        telefone: z.string({ required_error: 'Telefone é obrigatório' }).refine((value) => validaTelefone(value), {
            message: 'Telefone incorreto: digite no padrão (XX) XXXX-XXXX.',
        }),
        cpf: z.string({ required_error: 'CPF é obrigatório' }).trim()
            .refine((value) => validaCpf(value), { message: 'CPF incorreto: digite no padrão XXX.XXX.XXX-XX.' }),
        endereco: z.string({ required_error: 'Endereço é obrigatório' }).trim()
            .min(3, 'O endereço deve ter no mínimo 3 caracteres'),
    })

    const result = schema.safeParse(cliente);

    if (!result.success) {
        const errors = result.error.errors.map((err: any) => err.message);
        return errors;
    }
    return null; // Retorna null se a validação passar
}

//Validando dados do cliente na atualização de dados sensivéis (email e senha)
export function validaClienteSeguranca(cliente: usuarioClienteAtualizacaoDadosSensiveis) {
    const schema = z.object({
        email: z.string({ required_error: 'Email é obrigatório' }).trim()
            .email('E-mail inválido'),
        senha: z.string({ required_error: 'Senha é obrigatória' }).trim()
            .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    })

    const result = schema.safeParse(cliente);

    if (!result.success) {
        const errors = result.error.errors.map((err: any) => err.message);
        return errors;
    }
    return null; // Retorna null se a validação passar
}


////Validando dados do cliente no login
export function validaClienteLogin(prestador: usuarioClienteAtualizacaoDadosSensiveis) {
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