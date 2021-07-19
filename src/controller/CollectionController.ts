import { Request, Response } from "express";
import {
  Collection,
  PhotoCollectionInputDTO,
  PhotoCollectionUpdateInputDTO,
} from "../model/Collection";
import collectionBusiness from "../business/CollectionBusiness";

export class CollectionController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      const input: PhotoCollectionInputDTO = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image || undefined,
      };

      await collectionBusiness.createCollection(input, token);

      let message = "Collection created successfully!";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      if (error.message.includes("for key 'title'")) {
        res
          .status(409)
          .send({ error: "This collection title is already registered" });
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }
  }

  async get(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const collections = await collectionBusiness.getCollections(token);

      res.status(201).send({ collections });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const collection_id = req.params.collection_id;

      await collectionBusiness.deleteCollection(token, collection_id);

      const message = "Collection deleted successfully.";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;

      const collection_id = req.params.collection_id;

      const input: PhotoCollectionUpdateInputDTO = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image,
      };

      await collectionBusiness.updateCollection(token, collection_id, input);

      const message = "Collection updated successfully.";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }
  }
}

export default new CollectionController();
