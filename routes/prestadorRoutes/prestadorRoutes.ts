import { retornaUsuarioExistente} from "../../middlewares"; 
import { autenticaToken } from "../../middlewares"; 
import express from 'express';
import { criarPrestador, fazerLogin, listarTodosPrestadores, listarPrestadoresPorServico, atulizarPerfilPrestador, atualizarSegurancaPrestador, deletarPrestador, atualizarFotoPerfilPrestador,  } from "../../controller/prestadorController/prestadorController";
import { upload } from "../../config/multerConfig";

const prestadorRoutes = express();
prestadorRoutes.use(express.json())


//criando prestador de serviço e criptografando a senha
prestadorRoutes.post('/prestador', criarPrestador) 

//Cria token para determinado usuario (Fazer login)
prestadorRoutes.post('/login', fazerLogin)

//Criar foto para perfil do prestador
prestadorRoutes.put('/prestadorFoto', retornaUsuarioExistente, autenticaToken, upload('uploads/prestador'), atualizarFotoPerfilPrestador)

// Atualizando perfil do prestador
prestadorRoutes.put('/prestador', retornaUsuarioExistente, autenticaToken, atulizarPerfilPrestador)

// Atualizando dados de segurança do prestador (email e senha)
prestadorRoutes.put('/prestador/dadosSeguranca', retornaUsuarioExistente, autenticaToken, atualizarSegurancaPrestador)

// Listando todos os usuários com detalhes de um determinado prestador (se existirem)
prestadorRoutes.get('/prestador', listarTodosPrestadores)

// Listando os prestadores por tipo de serviço
prestadorRoutes.get('/prestadorservico', listarPrestadoresPorServico)

//Deletar um prestador e todos seus relacionamentos com usuario e anuncios
prestadorRoutes.delete('/prestador', retornaUsuarioExistente, autenticaToken, deletarPrestador)

export {prestadorRoutes};