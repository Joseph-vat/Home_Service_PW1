import { log } from "console";
import { prismaClient } from "./prismaClient";
import express, { Request, Response, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import { retornaPrestadorExistente } from "./middlewares";
import jwt from 'jsonwebtoken';
import { autenticaToken } from "./middlewares";


const app = express();
app.use(express.json())



//criando prestador de serviço e criptografando a senha
app.post('/prestador', async (req, res) => {
    const { nome, email, senha, telefone, foto, cnpj, horarioDisponibilidade } = req.body
    console.log(cnpj);
    console.log("aqui");


    const comparaUser = await prismaClient.usuario.findUnique({
        where: {
            email: email
        },
    })
    if (comparaUser !== null) {
        return res.status(400).json({ error: "Prestador já existe na base de dados. Cadastre um novo prestador!" })
    }
    try {
        const senhaCriptografada = await hash(senha, 5)
        const novoUsuario = await prismaClient.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                telefone,
                foto
            }
        })
        const novoPrestador = await prismaClient.prestadorServico.create({
            data: {
                cnpj,
                horarioDisponibilidade,
                anuncios: {
                    create: []
                },
                usuario: {
                    connect: {
                        id: novoUsuario.id
                    }
                }
            }
        });
        res.status(201).json({ message: 'Prestador de serviço criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar prestador de serviço' });
    }
})



//Cria token para determinado usuario (Fazer login)
app.post('/login', retornaPrestadorExistente, async (req, res) => {
    const { email, senha } = req.body
    const retornaUsuarioPrestador = await prismaClient.usuario.findUnique({
        where: {
            email: email
        },
    })
    try {
        if (retornaUsuarioPrestador !== null) {
            const compararSenhas = await compare(senha, retornaUsuarioPrestador.senha)
            if (!compararSenhas) {
                return { message: "senha invalida!" }
            }
            const prestadorId = retornaUsuarioPrestador.id

            const token = jwt.sign(
                { id: prestadorId },
                process.env.CHAVE_SECRETA as string,
                { expiresIn: '1d', subject: prestadorId }
            );

            return res.status(201).json(token)
        }
    } catch (error) {

    }

})


// Atualizando perfil do prestador
app.put('/prestador', retornaPrestadorExistente, autenticaToken, async (req, res) => {
    const { nome, telefone, endereco, foto, cnpj, horarioDisponibilidade } = req.body
    const id = req.autenticado

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
        const atualizaPrestador = await prismaClient.prestadorServico.update({
            where: {
                usuarioIdPrestador: id
            },
            data: {
                cnpj,
                horarioDisponibilidade
            }
        })
        return res.status(201).json("Prestador atualizado com sucesso ")
    } catch (error) {
        return res.status(404).json({ error: "Erro a atualizar prestador" })
    }
})


// Atualizando dados de segurança do prestador (email e senha)
app.put('/prestador/dadosSeguranca', retornaPrestadorExistente, autenticaToken, async (req, res) => {
    const { email, senha } = req.body
    const id = req.autenticado
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
        return res.status(201).json("Prestador atualizado com sucesso ")
    } catch (error) {
        return res.status(404).json({ error: "Erro a atualizar prestador" })
    }
})


// Listando todos os usuários com detalhes de prestadores (se existirem)
app.get('/prestador', async (req, res) => {
    try {
        const usuariosComPrestadores = await prismaClient.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                foto: true,
                prestador: {
                    select: {
                        cnpj: true,
                        horarioDisponibilidade: true,
                    },
                },
            },
        });

        return res.status(200).json(usuariosComPrestadores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao obter usuários e prestadores de serviço" });
    }
});



// Listando os prestadores por tipo de serviço
app.get('/prestadorservico', async (req, res) => {
    const servico = <string>req.body.servico.toLowerCase();
    try {
        const prestadores = await prismaClient.prestadorServico.findMany({
            where: {
                anuncios: {
                    some: {
                        servico: {
                            equals: servico
                        }
                    }
                }
            },
            include: {
                usuario: true 
            }
        });

        if (prestadores.length === 0) {
            return res.status(404).json({ error: 'Nenhum prestador encontrado para esse serviço' });
        }

        res.json({ prestadores });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar prestadores por serviço' });
    }
});


app.delete('/prestador', retornaPrestadorExistente, autenticaToken, async (req, res) => {
    const id = req.autenticado; // id do usuario autenticado
    console.log(id);
    
    try {
        // Deletando todos os anúncios do usuário Prestador antes de deletar o prestador
        await prismaClient.anuncio.deleteMany({
            where: {
                prestadorId: id
            }
        });

        try {
            // Deleta o prestador
            await prismaClient.prestadorServico.delete({
                where: {
                    usuarioIdPrestador: id
                },
            });

            try {
                // Deleta o usuário
                await prismaClient.usuario.delete({
                    where: {
                        id: id
                    },
                });

                return res.status(201).json({ message: 'Prestador deletado com sucesso!' });
            } catch (error) {
                // Caso haja falha ao deletar o usuário após excluir o prestador
                return res.status(500).json({ error: 'Erro ao deletar o usuário', details: error });
            }
        } catch (error) {
            // Caso haja falha ao deletar o prestador
            return res.status(500).json({ error: 'Erro ao deletar o prestador', details: error });
        }
    } catch (error) {
        // Caso haja falha ao deletar os anúncios do prestador
        return res.status(500).json({ error: 'Erro ao deletar os anúncios do prestador', details: error });
    }
});



app.listen(3005, () => {
    console.log("conectado");
})