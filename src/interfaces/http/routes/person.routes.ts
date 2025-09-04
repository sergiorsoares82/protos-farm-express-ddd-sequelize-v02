import express from 'express';
import { PersonsController } from '@src/interfaces/controllers/persons.controller';
const personRoutes = express.Router();

const personsController = new PersonsController();

personRoutes.get('/', personsController.search);

export default personRoutes;
