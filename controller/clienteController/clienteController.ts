import { prismaClient } from "../../prismaClient";
import express, { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import jwt from 'jsonwebtoken';
import {validaClienteSeguranca, validaClienteAtualizacao, validaClienteCriacao} from '../../validacoes/validaCliente'

const app = express();
app.use(express.json())

export async function criarCliente(req: Request, res: Response) {
    const { nome, email, senha, telefone, cpf, endereco } = req.body

    // Validando os dados do cliente
    const validacaoResult = await validaClienteCriacao({
        nome,
        email,
        senha,
        telefone,
        cpf,
        endereco
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Criando o cliente se a validação passar
    try {
        const senhaCriptografada = await hash(senha, 5)
        const novoUsuario = await prismaClient.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                telefone,
            }
        })
        const novoCliente = await prismaClient.cliente.create({
            data: {
                cpf,
                endereco,
                usuario: {
                    connect: {
                        id: novoUsuario.id
                    }
                }
            }
        });
        res.status(201).json({ message: 'Cliente de serviço criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
};

//Cria token para determinado usuario (Fazer login)
export async function fazerLogin(req: Request, res: Response) {
    const { email, senha } = req.body
    const retornaUsuarioCliente = await prismaClient.usuario.findUnique({
        where: {
            email: email
        }
    })
    try {
        if (retornaUsuarioCliente !== null) {
            const compararSenhas = await compare(senha, retornaUsuarioCliente.senha)
            if (!compararSenhas) {
                return { message: "senha invalida!" }
            }
            const clienteId = retornaUsuarioCliente.id

            const token = jwt.sign(
                { id: clienteId },
                process.env.CHAVE_SECRETA as string,
                { expiresIn: '1d', subject: clienteId }
            );

            return res.status(201).json(token)
        }
    } catch (error) {

    }

};

//criar foto do perfil 
export async function atualizarFotoPerfilCliente (req: Request, res: Response) {

    const idUsuario = req.autenticado
    const nomeFoto = req.file?.filename as string

    try {
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: idUsuario
            },
            data: {
                foto: nomeFoto
            }
        })
        return res.status(200).json("Foto atualizada com sucesso!")
    } catch (error) {
        return res.status(404).json({ error: "Erro a atualizar cliente" })
    }
}

// Atualizando perfil do cliente
export async function atulizarPerfilCliente(req: Request, res: Response) {
    const id = req.autenticado
    const { nome, telefone, foto, cpf, endereco } = req.body

    // Validando os dados do cliente
    const validacaoResult = await validaClienteAtualizacao({
        nome,
        telefone,
        foto,
        cpf,
        endereco
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Atualizando o cliente se a validação passar
    try {
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: id
            },
            data: {
                nome,
                telefone,
                foto
            }
        })
        const atualizaCliente = await prismaClient.cliente.update({
            where: {
                usuarioIdCliente: id
            },
            data: {
                cpf,
                endereco
            }
        })
        return res.status(201).json("Cliente atualizado com sucesso ")
    } catch (error) {
        return res.status(404).json({ error: "Erro a atualizar cliente" })
    }
};

// Atualizando dados de segurança do cliente (email e senha)
export async function atualizarSegurancaCliente(req: Request, res: Response) {
    const { email, senha } = req.body
    const id = req.autenticado

    // Validando os dados do cliente
    const validacaoResult = await validaClienteSeguranca({
        email,
        senha
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Atualizando o cliente se a validação passar

    const senhaCriptografada = await hash(senha, 5)
    try {
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: id
            },
            data: {
                email,
                senha: senhaCriptografada
            }
        })
        return res.status(201).json("Cliente atualizado com sucesso ")
    } catch (error) {
        return res.status(404).json({ error: "Erro a atualizar cliente" })
    }
};
//Listando todos os clientes
export async function listarClientes(req: Request, res: Response) {
    try {
        const clientes = await prismaClient.cliente.findMany({
            include: {
                usuario: true
            }
        })
        return res.status(200).json(clientes)
    } catch (error) {
        return res.status(404).json({ error: "Erro ao listar clientes" })
    }
};

//Deletando cliente
export async function deletarCliente(req: Request, res: Response) {
    const id = req.autenticado
    try {
        const deletaCliente = await prismaClient.cliente.delete({
            where: {
                usuarioIdCliente: id
            }
        })
        const deletaUsuario = await prismaClient.usuario.delete({
            where: {
                id: id
            }
        })
        return res.status(200).json("Cliente deletado com sucesso")
    } catch (error) {
        return res.status(404).json({ error: "Erro ao deletar cliente" })
    }
};