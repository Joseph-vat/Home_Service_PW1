import express from 'express';
import { anuncioRoutes } from './anuncioRoutes/anuncioRoutes';
import { prestadorRoutes } from './prestadorRoutes/prestadorRoutes';
import { clienteRoutes } from './clienteRoutes/clienteRoutes';
import { categoriaRoutes } from './categoriaRoutes/categoriaRoutes';

const routes = express();

routes.use(anuncioRoutes);
routes.use(prestadorRoutes)
routes.use(clienteRoutes)
routes.use(categoriaRoutes)
export { routes };