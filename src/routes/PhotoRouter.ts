import express from "express";
import photoController from "../controller/PhotoController";

export const photoRouter = express.Router();

photoRouter.post("/create", photoController.create);
photoRouter.get("/all", photoController.getAll)
photoRouter.get("/search", photoController.getByCondition)
photoRouter.get("/collection/:collection_id", photoController.getByCollection)
photoRouter.get("/:id", photoController.getById)
photoRouter.post("/:photo_id", photoController.addToCollection)


