import { criarAnuncio, deletaAnuncio, editaAnuncio, listaAnuncioPrestador, listaAnunciosPorCategoria, listaTodosAnuncios } from "../../controller/anuncioController/anuncioController";
import express from 'express';
import { retornaPrestadorExistente } from "../../middlewares/verificaPrestador";
import { autenticaTokenPrestador } from "../../middlewares/autenticaTokenPrestador";


const anuncioRoutes = express();
anuncioRoutes.use(express.json())


// cria anuncio associado a um prestador 
anuncioRoutes.post('/anuncio', retornaPrestadorExistente, autenticaTokenPrestador, criarAnuncio);

// lista os anuncios associados a um prestador
anuncioRoutes.get('/anunciosPrestador', retornaPrestadorExistente, autenticaTokenPrestador, listaAnuncioPrestador);

// lista todos os anuncios cadastrados
anuncioRoutes.get('/anuncios', listaTodosAnuncios);

//listar anuncios por categoria
anuncioRoutes.get('/anunciosCategoria/:id', listaAnunciosPorCategoria);

// edita um anuncio 
anuncioRoutes.put('/anuncios/:id', retornaPrestadorExistente, autenticaTokenPrestador, editaAnuncio);

// deleta um anuncio
anuncioRoutes.delete('/anuncio/:id', retornaPrestadorExistente, autenticaTokenPrestador, deletaAnuncio);

export { anuncioRoutes }