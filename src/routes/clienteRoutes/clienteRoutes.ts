import express from 'express';
import { atualizarFotoPerfilCliente, atulizarPerfilCliente, criarCliente, deletarCliente, listarClientes } from "../../controller/clienteController/clienteController";
import { upload } from "../../config/multerConfig";
import { fazerLogin } from "../../controller/clienteController/clienteController";
import { retornaClienteExistente } from '../../middlewares/verficaCliente';
import { autenticaTokenCliente } from '../../middlewares/autenticaTokenCliente'; 

const clienteRoutes = express();
clienteRoutes.use(express.json())

//criando cliente e criptografando a senha
clienteRoutes.post('/cliente', criarCliente)

//criando token para determinado usuario (Fazer login)
clienteRoutes.post('/login', fazerLogin)

//Criar foto para perfil do cliente
clienteRoutes.put('/clienteFoto', retornaClienteExistente, autenticaTokenCliente, upload('uploads/cliente'), atualizarFotoPerfilCliente)

// Atualizando perfil do cliente
clienteRoutes.put('/cliente', retornaClienteExistente, autenticaTokenCliente, atulizarPerfilCliente)

// Listando todos os clientes
clienteRoutes.get('/cliente', listarClientes)

// Deletando cliente
clienteRoutes.delete('/cliente', retornaClienteExistente, autenticaTokenCliente, deletarCliente)

export { clienteRoutes }