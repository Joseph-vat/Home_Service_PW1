import { log } from "console";
import { prismaClient } from "./prismaClient";
import express,{Request, Response, NextFunction} from 'express';


const app = express();
app.use(express.json())

//Funcão Middleware que checara se existe o prestador requerido no banco de dados
async function retornaPrestadorExistente(req: Request, res: Response, next: NextFunction) {
    const email = String(req.headers.email);
    const prestadorEncontrado = await prismaClient.prestadorServico.findUnique({
        where: {
            email: email
        }
    })
    if (prestadorEncontrado !== null){
        req.userExpr= prestadorEncontrado
        next();
    }else{
        res.status(500).json({ error: "Usuário não existe." });
    } 
}

//criando prestador de serviço
app.post('/prestador', async (req, res) => {
    const {nome, email, telefone, endereco, foto} = req.body
    const comparaUser = await prismaClient.prestadorServico.findUnique({
        where: {
            email: email,
          },
    })
    if(comparaUser !== null){
        return res.status(400).json({error: "Prestador já existe na base de dados. Cadastre um novo prestador!"})
     }

     const novoPrestador = await prismaClient.prestadorServico.create({
        data:{
            nome,
            email,
            endereco,
            foto,
            telefone,
            anuncios: {
                create: []
            },
        }
     })
     return res.status(201).json(novoPrestador)
})


// Atualizando prestador
app.put('/prestador/:id', retornaPrestadorExistente, async (req, res) => {
    const {nome, email, telefone, endereco, foto} = req.body
    const id = String(req.params.id)
    try {
        const comparaUser = await prismaClient.prestadorServico.update({
            where: {
                id:id
            },
            data: {
                nome,
                email,
                telefone,
                endereco,
                foto
            }
        })
        return res.status(201).json("Prestador atualizado com sucesso ")
    } catch (error) {
        return res.status(404).json({error: "Prestador não encontrada"})
    }
})


// Listando todos os prestadores de serviço
app.get('/prestador', async (req, res) => {
    try {
        const todosPrestadores = await prismaClient.prestadorServico.findMany();

        return res.status(200).json(todosPrestadores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao obter prestadores de serviço" });
    }
});


// Listando os prestadores por tipo de serviço
app.get('/prestadorservico', async (req, res) => {
    const servico = String(req.body.servico).toLowerCase();
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


//Deletando um prestador de serviço
app.delete('/prestador/:id', retornaPrestadorExistente, async (req,res) => {
    const { id } = req.params;     
    try {
        const prestadorEncontrado = await prismaClient.prestadorServico.delete({
            where: {
                id:id
            },
        })

        return res.status(201).json({message: 'Prestador deletado com sucesso!'})

    } catch (e) {
        return res.status(404).json({error: "Prestador não encontrado"}) 
    }    
})

app.listen(3005, () => {
    console.log("conectado");
})