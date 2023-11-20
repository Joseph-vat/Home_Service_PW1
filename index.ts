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
   
    // catch (e) {
    //     return res.status(404).json({error: "Prestador não encontrada"}) 
    // }
})

app.listen(3005, () => {
    console.log("conectado");
})