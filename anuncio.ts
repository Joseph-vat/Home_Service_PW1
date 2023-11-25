import { prismaClient } from "./prismaClient";
import express from 'express';
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


// lista os anuncios associados a um prestador
app.get('/anunciosPrestador', retornaPrestadorExistente, async (req, res) => {
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
});



// lista todos os anuncios cadastrados
app.get('/anuncios', async (req, res) => {
    try {
        const todosAnuncios = await prismaClient.anuncio.findMany();
        return res.status(200).json(todosAnuncios)
    }
    catch (Error) {
        res.status(400).json({ Error: "Não foi possível encontrar anúncios!" })
    }
});


app.listen(3005, () => {
    console.log("conectado");
});