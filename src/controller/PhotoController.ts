import { Request, Response } from "express";
import { PhotoInputDTO } from "../model/Photo";
import photoBusiness from "../business/PhotoBusiness";

export class PhotoController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      const input: PhotoInputDTO = {
        subtitle: req.body.subtitle,
        file: req.body.file,
        tags: req.body.tags,
        collection: req.body.collection,
      };

      await photoBusiness.createPhoto(input, token);

      let message = "Photo created successfully!";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const photos = await photoBusiness.getAllPhotos(token);

      res.status(201).send({ photos });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id

      const photo = await photoBusiness.getPhotoById(id,token);

      res.status(201).send({ photo });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }
}

export default new PhotoController();
