import express from 'express';
import { criarPrestador, fazerLogin, listarTodosPrestadores, listarPrestadoresPorServico, atualizarPerfilPrestador, atualizarSegurancaPrestador, deletarPrestador, atualizarFotoPerfilPrestador,  } from "../../controller/prestadorController/prestadorController";
import { upload } from "../../config/multerConfig";
import { retornaPrestadorExistente } from '../../middlewares/verificaPrestador';
import { autenticaToken } from '../../middlewares/autenticacaoToken';

const prestadorRoutes = express();
prestadorRoutes.use(express.json())


//criando prestador de serviço e criptografando a senha
prestadorRoutes.post('/prestador', criarPrestador) 

//Cria token para determinado usuario (Fazer login)
prestadorRoutes.post('/login', fazerLogin)

//Criar foto para perfil do prestador
prestadorRoutes.put('/prestadorFoto', retornaPrestadorExistente, autenticaToken, upload('uploads/prestador'), atualizarFotoPerfilPrestador)

// Atualizando perfil do prestador
prestadorRoutes.put('/prestador', retornaPrestadorExistente, autenticaToken, atualizarPerfilPrestador)

// Atualizando dados de segurança do prestador (email e senha)
prestadorRoutes.put('/prestador/dadosSeguranca', retornaPrestadorExistente, autenticaToken, atualizarSegurancaPrestador)

// Listando todos os usuários com detalhes de um determinado prestador (se existirem)
prestadorRoutes.get('/prestador', listarTodosPrestadores)

// Listando os prestadores por tipo de serviço
prestadorRoutes.get('/prestadorservico', listarPrestadoresPorServico)

//Deletar um prestador e todos seus relacionamentos com usuario e anuncios
prestadorRoutes.delete('/prestador', retornaPrestadorExistente, autenticaToken, deletarPrestador)

export {prestadorRoutes};