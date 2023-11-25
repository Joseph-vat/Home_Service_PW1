// import { retornaPrestadorExistente } from "./middlewares";
import { retornaPrestadorExistente } from "./middlewares";
import { criarAnuncio, deletaAnuncio, editaAnuncio, listaAnuncioPrestador, listaTodosAnuncios } from "./controller/anuncioController/anuncioController";
import express from 'express';

const app = express();
app.use(express.json())


// cria anuncio associado a um prestador 
app.post('/anuncio', retornaPrestadorExistente, criarAnuncio);

// lista os anuncios associados a um prestador
app.get('/anunciosPrestador', retornaPrestadorExistente, listaAnuncioPrestador);

// lista todos os anuncios cadastrados
app.get('/anuncios', listaTodosAnuncios);

// edita um anuncio 
app.put('/anuncios/:id', editaAnuncio);

// deleta um anuncio
app.delete('/anuncio/:id', deletaAnuncio);

app.listen(3005, () => {
    console.log("conectado");
});