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
        nickname: req.body.nickname,
        password: req.body.password,
      };
      const token = await userBusiness.createUser(input);

      res.status(200).send({ token });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      } else {
        res.status(error.statusCode).send({ error: error.message });
      }
      if (error.message.includes("for key 'nickname'")) {
        res.status(409).send({ error: "This nickname is already registered" });
      }
      if (error.message.includes("for key 'email'")) {
        res.status(409).send({ error: "This email is already registered" });
      }
    }

    await BaseDatabase.destroyConnection();
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = {
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
      };

      const token = await userBusiness.getUserByEmailOrNickname(loginData);

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
