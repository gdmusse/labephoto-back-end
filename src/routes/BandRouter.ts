import express from "express";
import bandController from "../controller/BandController";

export const bandRouter = express.Router();

bandRouter.post("/register", bandController.create);
bandRouter.get("", bandController.searchByIdOrName);
