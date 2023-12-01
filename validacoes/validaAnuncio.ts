import { z, ZodError } from 'zod';
import { anuncio } from '../interfaces';


function validaPreco(preco: string): boolean {
    // Lógica de validação do preço
    const formatoPreco = /^R\$ ?\d+(,\d{1,2})?$/; // Regex para o formato de moeda real (R$ 10,00)
    return formatoPreco.test(preco);
}


export function validaAnuncio(prestador: anuncio) {
    const schema = z.object({
        titulo: z.string({ required_error: 'Nome é obrigatório' }).trim()
        .min(3, 'O nome deve ter no mínimo 3 caracteres'),
        descricao: z.string({ required_error: 'Nome é obrigatório' }).trim(),
        preco: z.string({ required_error: 'O preço não pode estar vazio' }).trim()
            .refine((value) => validaPreco(value), { message: 'O preço deve estar no formato de moeda real (R$ 10,00).' }),
        servico: z.string({ required_error: 'Nome é obrigatório' }).trim()
        .min(3, 'O nome deve ter no mínimo 3 caracteres'),
        latitude: z.string({ required_error: 'Nome é obrigatório' }).trim()
        .min(2, 'O nome deve ter no mínimo 1 caractere'),
        longitude: z.string({ required_error: 'Nome é obrigatório' }).trim()
        .min(2, 'O nome deve ter no mínimo 1 caractere'),
    })

    const result = schema.safeParse(prestador);

    if (!result.success) {
        const errors = result.error.errors.map((err: any) => err.message);
        return errors;
    }
    return null; // Retorna null se a validação passar
}
