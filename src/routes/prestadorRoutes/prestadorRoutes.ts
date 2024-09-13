import express from 'express';
import { criarPrestador, listarTodosPrestadores, listarPrestadoresPorCategoria, listarPerfilPrestador, gerarLinkWhatsAppDoPrestador, atualizarPerfilPrestador, deletarPrestador, atualizarFotoPerfilPrestador  } from "../../controller/prestadorController/prestadorController";
import { upload } from "../../config/multerConfig";
import { retornaPrestadorExistente } from '../../middlewares/verificaPrestador';
import { autenticaTokenPrestador } from '../../middlewares/autenticaTokenPrestador';
import { fazerLogin } from '../../controller/usuarioController/usuarioController';

const prestadorRoutes = express();
prestadorRoutes.use(express.json())


//criando prestador de serviço e criptografando a senha
prestadorRoutes.post('/prestador', criarPrestador) 

//Cria token para determinado usuario (Fazer login)
prestadorRoutes.post('/login', fazerLogin)

//Criar foto para perfil do prestador
prestadorRoutes.put('/prestadorFoto', retornaPrestadorExistente, autenticaTokenPrestador, upload('uploads/prestador'), atualizarFotoPerfilPrestador)

// Atualizando perfil do prestador
prestadorRoutes.put('/prestador', retornaPrestadorExistente, autenticaTokenPrestador, atualizarPerfilPrestador)

// Listando todos os prestadores
prestadorRoutes.get('/prestador', listarTodosPrestadores)

// Listar dados do perfil de um prestador
prestadorRoutes.get('/prestadorPerfil', retornaPrestadorExistente, autenticaTokenPrestador, listarPerfilPrestador)

// Listando os prestadores por tipo de serviço (Categoria)
prestadorRoutes.get('/prestadores/categoria', listarPrestadoresPorCategoria);

//Gerar link do whats
prestadorRoutes.get('/whatsapp/:id', gerarLinkWhatsAppDoPrestador);

//Deletar um prestador e todos seus relacionamentos com usuario e anuncios
prestadorRoutes.delete('/prestador', retornaPrestadorExistente, autenticaTokenPrestador, deletarPrestador)

export {prestadorRoutes};