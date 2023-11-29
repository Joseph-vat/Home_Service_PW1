import { prismaClient } from "../../prismaClient";
import express, { Request, Response, NextFunction } from 'express';


// cria anuncio associado a um prestador 
export async function criarAnuncio(req: Request, res: Response) {
    const { titulo, descricao, latitude, longitude, preco, servico } = req.body;
    const id = req.autenticado;
    

    try {

        const novoAnunicio = await prismaClient.anuncio.create({
            data: {
                titulo,
                descricao,
                preco,
                servico,
                latitude,
                longitude,
                prestador: {
                    connect: {
                       usuarioIdPrestador : id
                    }
                }
            }
        })
        res.status(200).json(novoAnunicio);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível salvar anúncio!" })
    }

};

// lista os anuncios associados a um prestador
export async function listaAnuncioPrestador(req: Request, res: Response) {
    const prestadorId = req.userExpr.id
    try {
        const anuncios = await prismaClient.anuncio.findMany({
            where: {
                prestadorId
            }
        });
        return res.status(200).json(anuncios)
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncios!" })
    }
};

// lista todos os anuncios cadastrados
export async function listaTodosAnuncios(req: Request, res: Response) {
    try {
        const todosAnuncios = await prismaClient.anuncio.findMany();
        return res.status(200).json(todosAnuncios)
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncios!" })
    }
};

// edita um anuncio 
export async function editaAnuncio(req: Request, res: Response) {
    try {
        const { titulo, descricao, preco, servico, latitude, longitude } = req.body
        const id = req.autenticado;
        const anuncioEditado = await prismaClient.anuncio.update({
            where: {
                id: id
            },
            data: {
                titulo,
                descricao,
                latitude,
                longitude,
                preco,
                servico
            }
        });
        res.status(200).json(anuncioEditado);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncio!" })
    }
};

// deleta um anuncio
export async function deletaAnuncio(req: Request, res: Response) {
    const id = req.autenticado // id do anuncio que desejo deletar

    try {
        const anuncioDeletado = await prismaClient.anuncio.delete({
            where: {
                id
            }
        });
        res.status(200).json(anuncioDeletado);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível deletar anúncio!" })
    }
};