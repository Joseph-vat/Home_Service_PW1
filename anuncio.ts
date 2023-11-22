import { log } from "console";
import { prismaClient } from "./prismaClient";
import express, { Request, Response, NextFunction } from 'express';
import { retornaPrestadorExistente } from "./middlewares";


const app = express();
app.use(express.json())


// cria anuncio associado a um prestador 
app.post('/anuncio', retornaPrestadorExistente, async (req, res) => {
    const { titulo, descricao, preco, servico, latitude, longitude } = req.body;
    const id = req.userExpr.id;

    try {

        const novoAnunicio = await prismaClient.anuncio.create({
            data: {
                titulo,
                descricao,
                latitude,
                longitude,
                preco,
                servico,
                prestador: {
                    connect: {
                        id: id
                    }
                }
            }
        })
        res.status(200).json(novoAnunicio);
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível salvar anúncio!" })
    }

});