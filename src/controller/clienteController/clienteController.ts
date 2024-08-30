import express, { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import jwt from 'jsonwebtoken';
import { validaClienteAtualizacao, validaClienteCriacao, validaClienteLogin } from '../../validacoes/validaCliente'
import { prismaClient } from '../../database/prismaClient';

const app = express();
app.use(express.json())

//Criar cliente
export async function criarCliente(req: Request, res: Response) {
    const { nome, email, senha, telefone, cpf, endereco } = req.body

    // Verificar se o cliente já está cadastrado
    const usuarioCadastro = await prismaClient.usuario.findUnique({
        where: {
            email: email,
        }
    });

    if (usuarioCadastro !== null) {
        return res.status(409).json({ error: `Usuário ${nome} já existe` });
    }

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
        const clienteCadastro = await prismaClient.cliente.findUnique({
            where: {
                cpf:cpf
            }
        })
        if (clienteCadastro !== null) {
            return res.status(409).json({ error: "Já existe cliente cadastrado para esse CPF" });
        }
        const senhaCriptografada = await hash(senha, 5)
        const fotoPadrao = `${req.protocol}://${req.get('host')}/uploads/defaults/default.jpg`;

        const novoUsuario = await prismaClient.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                telefone,
                foto: fotoPadrao
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
        res.status(201).json({ message: `Cliente ${nome} criado com sucesso!` });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
};

//Cria token para determinado usuario (Fazer login)
export async function fazerLogin(req: Request, res: Response) {
    const { email, senha } = req.body

    // Validando os dados do prestador
    const validacaoResult = await validaClienteLogin({
        email,
        senha
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    const retornaUsuarioCliente = await prismaClient.usuario.findUnique({
        where: {
            email: email
        }
    })
    try {
        if (retornaUsuarioCliente === null) {
            return res.status(404).json({ error: "Cliente não existe." });
        } else {
            const compararSenhas = await compare(senha, retornaUsuarioCliente.senha)
            if (!compararSenhas) {
                return res.status(401).json({ error: "Senha ou Email incorreto!." });
            }
            const clienteId = retornaUsuarioCliente.id

            const token = jwt.sign(
                { id: clienteId },
                process.env.CHAVE_SECRETA as string,
                { expiresIn: '1d', subject: clienteId }
            );

            return res.status(200).json(token)
        }
    } catch (error) {
        return res.status(400).json({ error: "Erro ao fazer login do usuário" })

    }

};

//criar foto do perfil 
export async function atualizarFotoPerfilCliente(req: Request, res: Response) {

    const idUsuario = req.autenticado
    const nomeFoto = req.file?.filename as string

    if (!nomeFoto) {
        return res.status(400).json({ error: "Nenhuma foto foi enviada" });
    }

     // Constrói o caminho completo da URL para a foto
    const caminhoFoto = `${req.protocol}://${req.get('host')}/uploads/cliente/${nomeFoto}`;


    try {
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: idUsuario
            },
            data: {
                foto: caminhoFoto
            }
        })
        return res.status(200).json("Foto atualizada com sucesso!")
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar foto de cliente" })
    }
}

// Atualizando perfil do cliente
export async function atulizarPerfilCliente(req: Request, res: Response) {
    const id = req.autenticado
    const { nome, telefone, cpf, endereco } = req.body

    // Validando os dados do cliente
    const validacaoResult = await validaClienteAtualizacao({
        nome,
        telefone,
        cpf,
        endereco
    });

    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Atualizando o cliente se a validação passar
    try {

        //Não permite que o novo CPF que esta sendo atualizado,seja alterado para o mesmo CPF de outro cliente já existente na plataforma
        const clienteCadastro = await prismaClient.cliente.findUnique({
            where: {
                cpf: cpf
            }
        })
        console.log(clienteCadastro?.cpf);
        
        if (clienteCadastro?.usuarioIdCliente !== id && clienteCadastro?.cpf !== undefined) {
            return res.status(409).json({ error: "Já existe outro cliente cadastrado com esse CPF! Atualize o campo CPF com um CPF válido!" });
        }
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: id
            },
            data: {
                nome,
                telefone
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
        return res.status(200).json(`Cliente ${nome} atualizado com sucesso!`)
    } catch (error) {
        return res.status(400).json({ error: "Erro ao atualizar cliente" })
    }
};


//Deletando cliente
export async function deletarCliente(req: Request, res: Response) {
    const id = req.autenticado
    try {
        const cliente = await prismaClient.usuario.findUnique({
            where: {
                id
            }
        });
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
        return res.status(200).json(`Cliente ${cliente?.nome} deletado com sucesso!`)
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar cliente" })
    }
};
