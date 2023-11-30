import { retornaPrestadorExistente } from "./middlewares";
import express from 'express';
import multer from 'multer';
import { listenerCount } from "process";

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Diretório de destino dos arquivos
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo
    }
  });
  
const upload = multer({ storage: storage });

const anuncioRoutes = express();
anuncioRoutes.use(express.json())


// cria anuncio associado a um prestador 
anuncioRoutes.post('/upload', upload.single('file'), (req, res) => {
    return res.json(req.file?.filename);
});

anuncioRoutes.listen(3005)