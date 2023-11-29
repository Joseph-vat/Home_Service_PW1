import express from 'express';
import { anuncioRoutes } from './anuncio';
import { prestadorRoutes } from './prestador';

const routes = express();

routes.use(anuncioRoutes);
routes.use(prestadorRoutes)

export { routes };