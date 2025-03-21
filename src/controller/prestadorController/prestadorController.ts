import { prismaClient } from "../../database/prismaClient";
import express, { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import jwt from 'jsonwebtoken';
import { validaPrestadorAtualizacao, validaPrestadorCriacao, validaPrestadorLogin } from "../../validacoes/validaPrestador";
import { log } from "console";
import { resolve } from 'node:path';
import fs from 'fs';



const app = express();
app.use(express.json())



// Criar prestador
export async function criarPrestador(req: Request, res: Response) {
    const { nome, email, senha, telefone, cnpj, horarioDisponibilidade, latitude, longitude } = req.body

    // Verificar se o cliente já está cadastrado
    const usuarioCadastro = await prismaClient.usuario.findUnique({
        where: {
            email: email,
        }
    });

    if (usuarioCadastro !== null) {
        return res.status(409).json({ error: `Usuário ${nome} já existe` });
    }

    // Validando os dados do prestador
    const validacaoResult = await validaPrestadorCriacao({
        nome,
        email,
        senha,
        telefone,
        cnpj,
        horarioDisponibilidade,
        latitude,
        longitude
    });

    console.log(validacaoResult);


    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });

    }

    // Criando o prestador se a validação passar
    try {
        const prestadorCadastro = await prismaClient.prestadorServico.findUnique({
            where: {
                cnpj: cnpj
            }
        })
        if (prestadorCadastro !== null) {
            return res.status(409).json({ error: "Já existe prestador cadastrado para esse CNPJ" });
        }
        const senhaCriptografada = await hash(senha, 5)
        const fotoPadrao = `${req.protocol}://${req.get('host')}/files/defaults/default.png`;

        const novoUsuario = await prismaClient.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                telefone,
                foto: fotoPadrao,
                papel: 1
            }
        })
        const novoPrestador = await prismaClient.prestadorServico.create({
            data: {
                cnpj,
                horarioDisponibilidade,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
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
        res.status(201).json({ message: `Prestador de serviço ${nome} criado com sucesso` });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar prestador de serviço' });
    }
};

//Atualiza a foto do perfil do prestador
export async function atualizarFotoPerfilPrestador(req: Request, res: Response) {
    const idUsuario = req.autenticado
    const nomeFoto = req.file?.filename as string

    console.log("aqui: ");
    
    console.log(nomeFoto);

    if (!nomeFoto) {
        return res.status(400).json({ error: "Nenhuma foto foi enviada" });
    }

    const caminhoFoto = `${req.protocol}://${req.get('host')}/files/prestador/${nomeFoto}`;
    console.log("caminho: ");
    
    console.log(caminhoFoto);
    

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
        return res.status(400).json({ error: "Erro a atualizar foto do prestador" })
    }
};


// Atualizando perfil do prestador
export async function atualizarPerfilPrestador(req: Request, res: Response) {
    const id = req.autenticado
    const { nome, telefone, horarioDisponibilidade, latitude, longitude } = req.body

    // Validando os dados do prestador
    const validacaoResult = await validaPrestadorAtualizacao({
        nome,
        telefone,
        horarioDisponibilidade,
        latitude,
        longitude
    });

    console.log(validacaoResult);


    if (validacaoResult !== null) {
        return res.status(400).json({ error: validacaoResult });
    }

    // Atualizando o prestador se a validação passar
    try {
        const atualizaUsuario = await prismaClient.usuario.update({
            where: {
                id: id
            },
            data: {
                nome,
                telefone
            }
        })
        const atualizaPrestador = await prismaClient.prestadorServico.update({
            where: {
                usuarioIdPrestador: id
            },
            data: {
                horarioDisponibilidade,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        })
        return res.status(200).json(`Prestador ${nome} atualizado com sucesso`)
    } catch (error) {
        return res.status(500).json({ error: "Erro a atualizar prestador" })
    }
};

// Listando todos os prestadores de serviço
export async function listarTodosPrestadores(req: Request, res: Response) {
    try {
        const usuariosPrestadores = await prismaClient.usuario.findMany({
            where: {
                prestador: {
                    isNot: null // Verifica se o campo prestador não é nulo (ou seja, usuário é um prestador)
                }
            },
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
                        latitude: true,
                        longitude: true
                    },
                },
            },
        });

        return res.status(200).json(usuariosPrestadores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao obter prestadores de serviço" });
    }
};

// Listando prestador (Dados do perfil)
export async function listarPerfilPrestador(req: Request, res: Response) {
    const usuario = req.userExpr;

    // Atualizando o prestador se a validação passar
    try {
        const prestador = await prismaClient.prestadorServico.findUnique({
            where: {
                usuarioIdPrestador: usuario.id
            }
        });

        if (prestador == null) {
            return res.status(409).json({ error: "Ocorreu um erro ao carregar dados do perfil! :(" });
        }

        const prestadorCompleto = {
            name: usuario.nome,
            foto: usuario.foto,
            email: usuario.email,
            telefone: usuario.telefone,
            cnpj: prestador.cnpj,
            horarioDisponibilidade: prestador.horarioDisponibilidade,
        }
        return res.status(200).json(prestadorCompleto);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar dados de perfil do prestador" })
    }
};

//Listar prestadores de uma determinada categoria
export async function listarPrestadoresPorCategoria(req: Request, res: Response) {
    const { categoriaId } = req.body; // Pega o ID da categoria do corpo da solicitação

    if (!categoriaId) {
        return res.status(400).json({ error: 'O ID da categoria é necessário' });
    }

    try {
        // Primeiro, encontrar todos os anúncios que pertencem à categoria fornecida
        const anuncios = await prismaClient.anuncio.findMany({
            where: {
                categoriaId: categoriaId
            },
            select: {
                id: true,
                titulo: true,
                preco: true,
                prestadorId: true,
                categoria: {
                    select: {
                        icone: true,
                    },
                },
            },
        });

        if (anuncios.length === 0) {
            return res.status(404).json({ error: 'Nenhum anúncio encontrado para essa categoria' });
        }

        // Obter IDs dos prestadores baseados nos anúncios encontrados
        const prestadoresIds = anuncios.map(anuncio => anuncio.prestadorId);

        // Encontrar prestadores associados aos IDs obtidos
        const prestadores = await prismaClient.prestadorServico.findMany({
            where: {
                usuarioIdPrestador: {
                    in: prestadoresIds
                }
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        telefone: true,
                        foto: true,
                    }
                }
            }
        });

        if (prestadores.length === 0) {
            return res.status(404).json({ error: 'Nenhum prestador encontrado para essa categoria' });
        }

        // Mapear anúncios com dados dos prestadores
        const resultado = anuncios.map(anuncio => {
            const prestador = prestadores.find(p => p.usuarioIdPrestador === anuncio.prestadorId);
            if (prestador) {
                return {
                    prestador: {
                        nome: prestador.usuario.nome,
                        horarioDisponibilidade: prestador.horarioDisponibilidade,
                        latitude: prestador.latitude,
                        longitude: prestador.longitude
                    },
                    anuncio: {
                        titulo: anuncio.titulo,
                        preco: anuncio.preco,
                        iconeCategoria: anuncio.categoria.icone
                    }
                };
            }
            return null;
        }).filter(item => item !== null);

        res.status(200).json({ resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar prestadores por categoria' });
    }
};

// Deletar prestador
export async function deletarPrestador(req: Request, res: Response) {
    const id = req.autenticado; // id do usuario autenticado

    try {
        const prestador = await prismaClient.usuario.findUnique({
            where: {
                id
            }
        });
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

                return res.status(200).json({ message: `Prestador ${prestador?.nome} deletado com sucesso!` });
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
};