import { Request, Response } from "express";
import showBusiness from "../business/ShowBusiness";
import { WeekDay } from "../model/Show";

export class ShowController {
  async add(req: Request, res: Response) {
    try {
      const input = {
        band_id: req.body.band_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        week_day: req.body.week_day,
      };

      const token = req.headers.authorization!;

      await showBusiness.addShow(input, token);

      let message = "Show registered successfully!";

      res.status(201).send({ message });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }
  }

  async getShowsByDay(req: Request, res: Response) {
    try {
      const week_day = req.params.week_day as WeekDay;

      const shows = await showBusiness.getShowsByDay(week_day);

      res.status(201).send({ shows });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }
  }
}

export default new ShowController();
