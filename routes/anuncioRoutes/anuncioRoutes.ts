// import { retornaPrestadorExistente } from "./middlewares";
import { retornaPrestadorExistente } from "../../middlewares";
import { autenticaToken } from "../../middlewares"; 
import { criarAnuncio, deletaAnuncio, editaAnuncio, listaAnuncioPrestador, listaTodosAnuncios } from "../../controller/anuncioController/anuncioController";
import express from 'express';
import { upload } from "../../config/multerConfig";


const anuncioRoutes = express();
anuncioRoutes.use(express.json())


// cria anuncio associado a um prestador 
anuncioRoutes.post('/anuncio', retornaPrestadorExistente, autenticaToken, criarAnuncio);

// lista os anuncios associados a um prestador
anuncioRoutes.get('/anunciosPrestador', retornaPrestadorExistente, listaAnuncioPrestador);

// lista todos os anuncios cadastrados
anuncioRoutes.get('/anuncios', listaTodosAnuncios);

// edita um anuncio 
anuncioRoutes.put('/anuncios', retornaPrestadorExistente, autenticaToken, editaAnuncio);

// deleta um anuncio
anuncioRoutes.delete('/anuncio', retornaPrestadorExistente, autenticaToken, deletaAnuncio);

export { anuncioRoutes }