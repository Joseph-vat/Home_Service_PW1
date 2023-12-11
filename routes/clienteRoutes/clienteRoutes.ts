import { retornaClienteExistente } from "../../middlewares";
import { autenticaToken } from "../../middlewares"; 
import express from 'express';
import { atualizarFotoPerfilCliente, atualizarSegurancaCliente, atulizarPerfilCliente, criarCliente, deletarCliente, listarClientes } from "../../controller/clienteController/clienteController";
import { upload } from "../../config/multerConfig";
import { fazerLogin } from "../../controller/clienteController/clienteController";

const clienteRoutes = express();
clienteRoutes.use(express.json())

//criando cliente e criptografando a senha
clienteRoutes.post('/cliente', criarCliente)

//criando token para determinado usuario (Fazer login)
clienteRoutes.post('/login', fazerLogin)

//Criar foto para perfil do cliente
clienteRoutes.put('/clienteFoto', retornaClienteExistente, autenticaToken, upload('uploads/cliente'), atualizarFotoPerfilCliente)

// Atualizando perfil do cliente
clienteRoutes.put('/cliente', retornaClienteExistente, autenticaToken, atulizarPerfilCliente)

// Atualizando dados de segurança do cliente (email e senha)
clienteRoutes.put('/cliente/dadosSeguranca', retornaClienteExistente, autenticaToken, atualizarSegurancaCliente)

// Listando todos os clientes
clienteRoutes.get('/cliente', listarClientes)

// Deletando cliente
clienteRoutes.delete('/cliente', retornaClienteExistente, autenticaToken, deletarCliente)

export { clienteRoutes }