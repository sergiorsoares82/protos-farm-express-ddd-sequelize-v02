import express from 'express';
import personRoutes from './person.routes';
const routes = express.Router();

routes.use('/persons', personRoutes);

export default routes;
