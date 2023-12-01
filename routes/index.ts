import express from 'express';
import { anuncioRoutes } from './anuncioRoutes/anuncioRoutes';
import { prestadorRoutes } from './prestadorRoutes/prestadorRoutes';

const routes = express();

routes.use(anuncioRoutes);
routes.use(prestadorRoutes)

export { routes };