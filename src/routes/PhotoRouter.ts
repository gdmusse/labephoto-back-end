import express from "express";
import photoController from "../controller/PhotoController";

export const photoRouter = express.Router();

photoRouter.post("/create", photoController.create);
photoRouter.get("/all", photoController.getAll)
photoRouter.get("/:id", photoController.getById)

