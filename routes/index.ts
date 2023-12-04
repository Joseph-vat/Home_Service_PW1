import express from 'express';
import { anuncioRoutes } from './anuncioRoutes/anuncioRoutes';
import { prestadorRoutes } from './prestadorRoutes/prestadorRoutes';
import { clienteRoutes } from './clienteRoutes/clienteRoutes';

const routes = express();

routes.use(anuncioRoutes);
routes.use(prestadorRoutes)
routes.use(clienteRoutes)
export { routes };