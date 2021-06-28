import { Request, Response } from "express";
import bandBusiness from "../business/BandBusiness";
import { Band, BandInputDTO } from "../model/Band";

export class BandController {
  async create(req: Request, res: Response) {
    try {
      const input: BandInputDTO = {
        name: req.body.name,
        music_genre: req.body.musicGenre,
        responsible: req.body.responsible,
      };

      const token = req.headers.authorization!;

      await bandBusiness.createBand(input, token);

      let message = "Band registered successfully!";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      if (error.message.includes("Duplicate entry")) {
        res
          .status(409)
          .send({ error: "There's a band with this name already" });
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }
  }

  async searchByIdOrName(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      const name = req.query.name as string;

      if (id) {
        const band = await bandBusiness.getBandById(id);
        res.status(200).send({ band });
      } else {
        const band = await bandBusiness.getBandByName(name);
        res.status(200).send({ band });
      }
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }

      res.status(error.statusCode).send({ error: error.message });
    }
  }
}

export default new BandController();
