import express from 'express';
import { routes } from './routes/index';
import cors from 'cors';
import path from 'path';

const app = express();

// Configuração para servir arquivos estáticos
// app.use("/files", express.static("uploads"));

app.use('/files', express.static(path.resolve(__dirname, 'uploads')));


// Configurações e middlewares
app.use(express.json());
app.use(cors());

// Suas rotas
app.use(routes);

app.listen(3005, () => {
    console.log("Servidor rodando na porta 3005");
});
