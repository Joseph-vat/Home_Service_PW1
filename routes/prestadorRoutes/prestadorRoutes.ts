import { retornaPrestadorExistente } from "../../middlewares"; 
import { autenticaToken } from "../../middlewares"; 
import express from 'express';
import { criarPrestador, fazerLogin, listarTodosPrestadores, listarPrestadoresPorServico, atulizarPerfilPrestador, atualizarSegurancaPrestador, deletarPrestador } from "../../controller/prestadorController/prestadorController";
import { upload } from "../../config/multerConfig";

const prestadorRoutes = express();
prestadorRoutes.use(express.json())


//criando prestador de serviço e criptografando a senha
prestadorRoutes.post('/prestador', upload.single('file'), criarPrestador) 

prestadorRoutes.put('/prestadorFoto', criarPrestador)

//Cria token para determinado usuario (Fazer login)
prestadorRoutes.post('/login', retornaPrestadorExistente, fazerLogin)

// Atualizando perfil do prestador
prestadorRoutes.put('/prestador', retornaPrestadorExistente, autenticaToken, atulizarPerfilPrestador)

// Atualizando dados de segurança do prestador (email e senha)
prestadorRoutes.put('/prestador/dadosSeguranca', retornaPrestadorExistente, autenticaToken, atualizarSegurancaPrestador)

// Listando todos os usuários com detalhes de prestadores (se existirem)
prestadorRoutes.get('/prestador', listarTodosPrestadores)

// Listando os prestadores por tipo de serviço
prestadorRoutes.get('/prestadorservico', listarPrestadoresPorServico)

//Deletar um prestador e todos seus relacionamentos com usuario e anuncios
prestadorRoutes.delete('/prestador', retornaPrestadorExistente, autenticaToken, deletarPrestador)

export {prestadorRoutes};