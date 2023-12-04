import { retornaUsuarioExistente} from "../../middlewares"; 
import { autenticaToken } from "../../middlewares"; 
import express from 'express';
import { atualizarFotoPerfilCliente, atulizarPerfilCliente, criarCliente } from "../../controller/clienteController/clienteController";
import { upload } from "../../config/multerConfig";
import { fazerLogin } from "../../controller/clienteController/clienteController";

const clienteRoutes = express();
clienteRoutes.use(express.json())

//criando cliente e criptografando a senha
clienteRoutes.post('/cliente', criarCliente)

//criando token para determinado usuario (Fazer login)
clienteRoutes.post('/login', fazerLogin)

//Criar foto para perfil do cliente
clienteRoutes.put('/clienteFoto', retornaUsuarioExistente, autenticaToken, upload('uploads/cliente'), atualizarFotoPerfilCliente)

// Atualizando perfil do cliente
clienteRoutes.put('/cliente', retornaUsuarioExistente, autenticaToken, atulizarPerfilCliente)