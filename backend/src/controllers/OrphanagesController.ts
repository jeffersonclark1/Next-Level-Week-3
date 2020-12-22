import { getRepository } from 'typeorm';
import {Request, Response} from 'express';
import Orphange from '../models/Orphanage';

export default {
  async index (req: Request, res : Response){
    const orphanagesRepository = getRepository(Orphange);

    const orphanages = await orphanagesRepository.find();

    return res.json(orphanages);
  },
  
  async show (req: Request, res : Response){
    const { id } = req.params;

    const orphanagesRepository = getRepository(Orphange);

    const orphanage = await orphanagesRepository.findOneOrFail(id);

    return res.json(orphanage);
  },

  async create (req: Request, res : Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body;
  
    const orphanagesRepository = getRepository(Orphange);
  
    const orphange = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    });
  
    await orphanagesRepository.save(orphange);
  
    return res.status(201).json(orphange);
  }
};