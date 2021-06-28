import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import userBusiness from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const input: UserInputDTO = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
      };
      const token = await userBusiness.createUser(input);

      res.status(200).send({ token });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      if (error.message.includes("Duplicate entry")) {
        res.status(409).send({ error: "This email is already registered" });
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
    }

    await BaseDatabase.destroyConnection();
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = {
        email: req.body.email,
        password: req.body.password,
      };

      const token = await userBusiness.getUserByEmail(loginData);

      res.status(200).send({ token });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      res.status(error.statusCode).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}

export default new UserController();
