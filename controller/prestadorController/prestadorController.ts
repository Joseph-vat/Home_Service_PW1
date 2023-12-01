import { prismaClient } from "../../prismaClient";
import express, { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from "crypto";
import jwt from 'jsonwebtoken';
import { validaPrestador } from "../../validacoes/validaPrestador";



const app = express();
app.use(express.json())




//criando prestador de serviço e criptografando a senha
// export async function criarPrestador(req: Request, res: Response) {
//     const { nome, email, senha, telefone, foto, cnpj, horarioDisponibilidade } = req.body

//     //mandando dados para a função validaPrestador que validara os dados antes de serem criados no banco
//     const validacaoResult = await validaPrestador({
//         nome,
//         email,
//         senha,
//         telefone,
//         foto,
//         cnpj,
//         horarioDisponibilidade
//     });

//     if (validacaoResult !== null) {
//         return res.status(400).json({ error: validacaoResult });
//     }

//     const comparaUser = await prismaClient.usuario.findUnique({
//         where: {
//             email: email
//         },
//     })
//     if (comparaUser !== null) {
//         return res.status(400).json({ error: "Prestador já existe na base de dados. Cadastre um novo prestador!" })
//     }
//     try {
//         const senhaCriptografada = await hash(senha, 5)
//         const novoUsuario = await prismaClient.usuario.create({
//             data: {
//                 nome,
//                 email,
//                 senha: senhaCriptografada,
//                 telefone,
//                 foto
//             }
//         })
//         const novoPrestador = await prismaClient.prestadorServico.create({
//             data: {
//                 cnpj,
//                 horarioDisponibilidade,
//                 anuncios: {
//                     create: []
//                 },
//                 usuario: {
//                     connect: {
//                         id: novoUsuario.id
//                     }
//                 }
//             }
//         });
//         res.status(201).json({ message: 'Prestador de serviço criado com sucesso' });
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao criar prestador de serviço' });
//     }
// };

export async function criarPrestador(req: Request, res: Response) {
    const { nome, email, senha, telefone, foto, cnpj, horarioDisponibilidade } = req.body
  
    // Validando os dados do prestador
    const validacaoResult = await validaPrestador({
      nome,
      email,
      senha,
      telefone,
      foto,
      cnpj,
      horarioDisponibilidade
    });
  
    if (validacaoResult !== null) {
      return res.status(400).json({ error: validacaoResult });
    }
  
    // Criando o prestador se a validação passar
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
  };



//Cria token para determinado usuario (Fazer login)
export async function fazerLogin(req: Request, res: Response) {
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

};

// Atualizando perfil do prestador
export async function atulizarPerfilPrestador(req: Request, res: Response) {
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
};


// Atualizando dados de segurança do prestador (email e senha)
export async function atualizarSegurancaPrestador(req: Request, res: Response) {
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
};


// Listando todos os usuários prestaores com detalhes
export async function listarTodosPrestadores(req: Request, res: Response) {
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
};



// Listando os prestadores por tipo de serviço
export async function listarPrestadoresPorServico(req: Request, res: Response) {
    const servico = <string>req.body.servico.toLowerCase();
    console.log(servico);

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
                usuario: {
                    select: {
                        id: false,
                        nome: true,
                        email: true,
                        telefone: true,
                        foto: true,
                        // cliente: true,  verificar depois se eu quiser ver clientes associados a prestador
                    }
                },
            }
        });

        if (prestadores.length === 0) {
            return res.status(404).json({ error: 'Nenhum prestador encontrado para esse serviço' });
        }

        const prestadoresComUsuarioPrimeiro = prestadores.map((prestador) => {
            return {
                ...prestador.usuario,
                prestador: {
                    cnpj: prestador.cnpj,
                    horarioDisponibilidade: prestador.horarioDisponibilidade
                }
            };
        });

        res.json({ prestadores: prestadoresComUsuarioPrimeiro });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar prestadores por serviço' });
    }
};





export async function deletarPrestador(req: Request, res: Response) {
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
};