import { Request, Response } from "express";
import { PhotoToCollectionInputDTO, PhotoInputDTO, PhotoSearchInputDTO } from "../model/Photo";
import photoBusiness from "../business/PhotoBusiness";

export class PhotoController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      const input: PhotoInputDTO = {
        subtitle: req.body.subtitle,
        file: req.body.file,
        tags: req.body.tags,
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

      const id = req.params.id;

      const photo = await photoBusiness.getPhotoById(id, token);

      res.status(201).send({ photo });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  async addToCollection(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const input: PhotoToCollectionInputDTO = {
        photo_id: req.params.photo_id,
        collection_id: req.body.collection_id,
      };

      await photoBusiness.addPhotoToCollection(input, token);

      let message = "Photo added to collection successfully!";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      if (error.message.includes("collection_id")) {
        res.status(409).send({ error: "Collection not found" });
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }
  }

  async getByCondition(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const input: PhotoSearchInputDTO = {
        author: req.query.author as string,
        subtitle: req.query.subtitle as string,
        tag: req.query.tag as string
      }

      const photo = await photoBusiness.getPhotoByCondition(input, token);

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
