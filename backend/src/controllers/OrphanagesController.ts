import { getRepository } from 'typeorm';
import {Request, Response} from 'express';
import Orphange from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
  async index (req: Request, res : Response){
    const orphanagesRepository = getRepository(Orphange);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    // return res.json(orphanages);
    return res.json(orphanageView.renderMany(orphanages));
  },
  
  async show (req: Request, res : Response){
    const { id } = req.params;

    const orphanagesRepository = getRepository(Orphange);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return res.json(orphanageView.render(orphanage));
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

    const requestImages = req.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    };

    const scheme = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude:  Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
        path: Yup.string().required()
      })
      )
    });

    await scheme.validate(data, {
      abortEarly: false,
    });
  
    const orphange = orphanagesRepository.create(data);
  
    await orphanagesRepository.save(orphange);
  
    return res.status(201).json(orphange);
  }
};