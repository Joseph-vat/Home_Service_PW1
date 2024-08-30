import express from 'express';
import { upload } from "../../config/multerConfig";
import { criarCategoria, listarCategorias, editarCategoria, deletarCategoria} from '../../controller/categoriaController/categoriaController';



const categoriaRoutes = express();
categoriaRoutes.use(express.json())

//Criar categoria
categoriaRoutes.post('/categorias', upload('uploads/categorias'), criarCategoria);

// lista todos as categorias cadastrados
categoriaRoutes.get('/listCategorias', listarCategorias);

//Editar uma categgoria
categoriaRoutes.put('/categorias/:id', editarCategoria);

//Deletar categoria
categoriaRoutes.delete('/categoria/:id', deletarCategoria);

export { categoriaRoutes }