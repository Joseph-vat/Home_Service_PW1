import { Request, Response } from 'express';
import { prismaClient } from '../../database/prismaClient';
import { upload } from '../../config/multerConfig';
import { unlink } from 'fs';
import { resolve } from 'path';


// Cria categoria
export async function criarCategoria(req: Request, res: Response) {
    try {
        // Verifica se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não enviado' });
        }

        const { servico } = req.body;
        const file = req.file; // Tipo do arquivo
        const filename = file.filename; // Acessa o nome do arquivo

        // Verifica se o campo 'servico' está presente
        if (!servico || !filename) {
            return res.status(400).json({ error: "Campos 'servico' e 'icone' são obrigatórios." });
        }

        // Constrói o caminho completo para o ícone da categoria
        const caminhoIcone = `${req.protocol}://${req.get('host')}/files/categorias/${filename}`;

        // Cria uma nova categoria no banco de dados
        const novaCategoria = await prismaClient.categoria.create({
            data: {
                servico,
                icone: caminhoIcone, // Armazenamos o caminho completo do arquivo na base de dados
            },
        });

        res.status(201).json(novaCategoria);
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ error: 'Erro ao criar a categoria' });
    }
}


//Listar todas as categorias
export async function listarCategorias(req: Request, res: Response) {
    try {
        // Consulta todas as categorias no banco de dados
        const categorias = await prismaClient.categoria.findMany({
            orderBy: {
                servico: 'asc',
            },
          });

        // Retorna as categorias como resposta
        return res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Não foi possível listar as categorias." });
    }
}


// Editar uma categoria
export async function editarCategoria(req: Request, res: Response) {
    const id = req.params.id as string; // Pega o ID da categoria como string

    // Usa a função de upload com o destino desejado
    upload('uploads/categorias')(req, res, async (err: any) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no upload do arquivo.' });
        }

        const { servico } = req.body;
        const file = req.file; // Tipo do arquivo

        try {
            // Verifica se a categoria existe
            const categoriaExistente = await prismaClient.categoria.findUnique({
                where: { id: id }, // Usando o id como string
            });

            if (!categoriaExistente) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            // Preparando os dados para atualização
            const data: any = {};
            if (servico) data.servico = servico;
            if (file) {
                // Atualiza o caminho do ícone
                const filename = file.filename;
                const caminhoIcone = `${req.protocol}://${req.get('host')}/files/categorias/${filename}`;
                data.icone = caminhoIcone;
            }

            // Atualiza a categoria no banco de dados
            const categoriaAtualizada = await prismaClient.categoria.update({
                where: { id: id }, // Usando o id como string
                data,
            });

            return res.status(200).json(categoriaAtualizada);
        } catch (error) {
            console.error('Erro ao editar categoria:', error);
            return res.status(500).json({ error: 'Erro ao editar a categoria' });
        }
    });
}


//Deletar categoria
export async function deletarCategoria(req: Request, res: Response) {
    const { id } = req.params; // Pega o ID da categoria dos parâmetros da rota

    try {
        // Verifica se a categoria existe
        const categoriaExistente = await prismaClient.categoria.findUnique({
            where: { id },
        });

        if (!categoriaExistente) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        // Pega o caminho completo do arquivo de ícone para exclusão
        const iconePath = resolve(__dirname, '..', 'uploads', 'categorias', categoriaExistente.icone);

        // Deleta a categoria do banco de dados
        await prismaClient.categoria.delete({
            where: { id },
        });

        // Deleta o arquivo de ícone associado, se existir
        unlink(iconePath, (err) => {
            if (err) {
                console.error('Erro ao deletar o ícone:', err);
            }
        });

        return res.status(200).json({ message: 'Categoria deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        return res.status(500).json({ error: 'Erro ao deletar a categoria' });
    }
}

