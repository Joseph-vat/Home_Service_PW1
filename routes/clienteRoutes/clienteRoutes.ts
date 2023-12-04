import { retornaUsuarioExistente} from "../../middlewares"; 
import { autenticaToken } from "../../middlewares"; 
import express from 'express';
import { criarCliente } from "../../controller/clienteController/clienteController";
import { upload } from "../../config/multerConfig";
import { fazerLogin } from "../../controller/prestadorController/prestadorController";

const clienteRoutes = express();
clienteRoutes.use(express.json())

//criando cliente e criptografando a senha
clienteRoutes.post('/cliente', criarCliente)

//criando token para determinado usuario (Fazer login)
clienteRoutes.post('/login', fazerLogin)