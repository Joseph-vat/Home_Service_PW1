import { z, ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';
import { anuncio } from '../interfaces/interfaceAnuncio';

const prisma = new PrismaClient();


function validaPreco(preco: string): boolean {
    // Lógica de validação do preço
    const formatoPreco = /^R\$ ?\d+(,\d{1,2})?$/; // Regex para o formato de moeda real (R$ 10,00)
    return formatoPreco.test(preco);
}


export async function validaAnuncio(anuncio: anuncio) {
    const schema = z.object({
        titulo: z.string({ required_error: 'Título é obrigatório' }).trim()
        .min(3, 'O título deve ter no mínimo 3 caracteres'),
        descricao: z.string({ required_error: 'Descrição é obrigatório' }).trim(),
        preco: z.string({ required_error: 'O preço não pode estar vazio' }).trim()
            .refine((value) => validaPreco(value), { message: 'O preço deve estar no formato de moeda real (R$ 10,00).' }),
        categoriaId: z.string({ required_error: 'Categoria é obrigatória' }).trim()
    })

    const result = schema.safeParse(anuncio);

    if (!result.success) {
        const errors = result.error.errors.map((err: any) => err.message);
        return errors;
    }
    // Verificação de existência da categoria no banco de dados
    const categoria = await prisma.categoria.findUnique({
        where: { id: anuncio.categoriaId },
    });

    if (!categoria) {
        return ['Categoria inválida.'];
    }
    return null; // Retorna null se a validação passar
}
