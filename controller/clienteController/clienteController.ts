import { prismaClient } from "../../prismaClient";
import express, { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import jwt from 'jsonwebtoken';
import {validaClienteCriacao} from '../../validacoes/validaCliente'

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
        const novoPrestador = await prismaClient.cliente.create({
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