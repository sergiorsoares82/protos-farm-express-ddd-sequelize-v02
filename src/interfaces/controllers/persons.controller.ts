import { Request, Response } from 'express';

export class PersonsController {
  create = async (req: Request, res: Response) => {
    // Logic for creating a person
    res.status(201).json({ message: 'Person created' });
  };

  search = async (req: Request, res: Response) => {
    // Logic for searching persons
    res.status(200).json({ message: 'Persons retrieved' });
  };
}
