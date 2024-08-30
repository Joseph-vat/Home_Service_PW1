import express, { Request, Response, NextFunction } from 'express';
import { validaAnuncio } from "../../validacoes/validaAnuncio";
import { prismaClient } from '../../database/prismaClient';
import { title } from 'node:process';


// cria anuncio associado a um prestador 
export async function criarAnuncio(req: Request, res: Response) {
    const { titulo, descricao, preco, categoriaId } = req.body;
    const id = req.autenticado;

    // Validando os dados do anúncio
    const validacaoResult = await validaAnuncio({
        titulo,
        descricao,
        preco,
        categoriaId
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Verifica se já existe anúncio com o mesmo titulo para o mesmo prestador
    const anuncioExiste = await prismaClient.anuncio.findFirst({
        where: {
            titulo,
            prestadorId: id
        }
    });

    if (anuncioExiste) {
        return res.status(400).json({ Error: 'Não foi possível criar anúncio! Título duplicado para o mesmo prestador.' });
    }

    try {
        const novoAnuncio = await prismaClient.anuncio.create({
            data: {
                titulo,
                descricao,
                preco,
                categoria: {
                    connect: {
                        id: categoriaId
                    }
                },
                prestador: {
                    connect: {
                        usuarioIdPrestador: id
                    }
                }
            }
        })
        res.status(201).json(`Anuncio ${titulo} criado com sucesso!`);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível salvar anúncio!" })
    }

};

// lista os anuncios associados a um prestador
export async function listaAnuncioPrestador(req: Request, res: Response) {
    const prestadorId = req.userExpr.id;
    try {
        const anuncios = await prismaClient.anuncio.findMany({
            where: {
                prestadorId,
            },
            include: {
                prestador: {
                    include: {
                        usuario: true,
                    },
                },
            },
        });
        return res.status(200).json(anuncios);
    } catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncios!" });
    }
}



// lista todos os anuncios cadastrados
export async function listaTodosAnuncios(req: Request, res: Response) {
    try {
        const todosAnuncios = await prismaClient.anuncio.findMany({
            include: {
                prestador: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                telefone: true,
                                foto: true, // Inclua outros campos que desejar, mas não a senha
                            },
                        },
                    },
                },
                categoria: {
                    select: {
                        id: true,
                        servico: true,
                        icone: true,
                    },
                },
            },
        });
        return res.status(200).json(todosAnuncios);
    } catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncios!" });
    }
}


// edita um anuncio 
export async function editaAnuncio(req: Request, res: Response) {
    const { titulo, descricao, preco, categoriaId} = req.body
    const id = req.params.id;

    // Validando os dados do anúncio
    const validacaoResult = await validaAnuncio({
        titulo,
        descricao,
        preco,
        categoriaId
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }
    try {
        const anuncioEditado = await prismaClient.anuncio.update({
            where: {
                id: id
            },
            data: {
                titulo,
                descricao,
                preco,
                categoria: {
                    connect: {
                        id: categoriaId
                    }
                }
            }
        });
        res.status(200).json(`Anúncio ${titulo} editado com sucesso!`);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível atualizar anúncio!" })
    }
};

// deleta um anuncio
export async function deletaAnuncio(req: Request, res: Response) {
    const id = req.params.id

    try {
        const anuncio = await prismaClient.anuncio.findUnique({
            where: {
                id
            }
        });
        const anuncioDeletado = await prismaClient.anuncio.delete({
            where: {
                id: id
            }
        });
        res.status(200).json(`Anúncio ${anuncio?.titulo} deletado com sucesso!`);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível deletar anúncio!" })
    }
};
