import express from "express";
import photoController from "../controller/PhotoController";

export const photoRouter = express.Router();

photoRouter.post("/create", photoController.create);
photoRouter.get("/all", photoController.getAll)
photoRouter.get("/search", photoController.getByCondition)
photoRouter.get("/collection/:collection_id", photoController.getByCollection)
photoRouter.get("/:id", photoController.getById)
photoRouter.get("/user/:author_id", photoController.getByAuthorId)
photoRouter.post("/:photo_id", photoController.addToCollection)
photoRouter.put("/:id", photoController.updateById)
photoRouter.delete("/:id",photoController.deleteById)
photoRouter.delete("/:collection_id/:photo_id", photoController.removeFromCollection)
