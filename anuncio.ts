// import { retornaPrestadorExistente } from "./middlewares";
import { retornaPrestadorExistente } from "./middlewares";
import { criarAnuncio, deletaAnuncio, editaAnuncio, listaAnuncioPrestador, listaTodosAnuncios } from "./controller/anuncioController/anuncioController";
import express from 'express';


const anuncioRoutes = express();
anuncioRoutes.use(express.json())


// cria anuncio associado a um prestador 
anuncioRoutes.post('/anuncio', retornaPrestadorExistente, criarAnuncio);

// lista os anuncios associados a um prestador
anuncioRoutes.get('/anunciosPrestador', retornaPrestadorExistente, listaAnuncioPrestador);

// lista todos os anuncios cadastrados
anuncioRoutes.get('/anuncios', listaTodosAnuncios);

// edita um anuncio 
anuncioRoutes.put('/anuncios/:id', editaAnuncio);

// deleta um anuncio
anuncioRoutes.delete('/anuncio/:id', deletaAnuncio);

anuncioRoutes.listen(3005, () => {
    console.log("conectado");
});

export { anuncioRoutes }