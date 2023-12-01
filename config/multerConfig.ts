import multer from 'multer';

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório de destino dos arquivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo
  }
});

export const upload = multer({ storage: storage });