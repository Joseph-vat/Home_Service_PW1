import express from 'express';
import { atualizarFotoPerfilCliente, listarPerfilCliente, atulizarPerfilCliente, criarCliente, deletarCliente } from "../../controller/clienteController/clienteController";
import { upload } from "../../config/multerConfig";
import { retornaClienteExistente } from '../../middlewares/verficaCliente';
import { autenticaTokenCliente } from '../../middlewares/autenticaTokenCliente'; 
import { fazerLogin } from '../../controller/usuarioController/usuarioController';

const clienteRoutes = express();
clienteRoutes.use(express.json());

//criando cliente e criptografando a senha
clienteRoutes.post('/cliente', criarCliente);

//criando token para determinado usuario (Fazer login)
clienteRoutes.post('/login', fazerLogin);

//Criar foto para perfil do cliente
clienteRoutes.put('/clienteFoto', retornaClienteExistente, autenticaTokenCliente, upload('uploads/cliente'), atualizarFotoPerfilCliente);

// Atualizando perfil do cliente
clienteRoutes.put('/cliente', retornaClienteExistente, autenticaTokenCliente, atulizarPerfilCliente);

// Listar dados do perfil de um prestador
clienteRoutes.get('/clientePerfil', retornaClienteExistente, autenticaTokenCliente, listarPerfilCliente);

// Deletando cliente
clienteRoutes.delete('/cliente', retornaClienteExistente, autenticaTokenCliente, deletarCliente);

export { clienteRoutes }