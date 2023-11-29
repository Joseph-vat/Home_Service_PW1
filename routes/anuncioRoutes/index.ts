import express from 'express';
import { anuncioRoutes } from './anuncio';

const routes = express();

routes.use(anuncioRoutes);

export { routes };