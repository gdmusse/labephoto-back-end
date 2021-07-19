import express from "express";
import collectionController from "../controller/CollectionController";

export const collectionRouter = express.Router();

collectionRouter.post("/create", collectionController.create);
collectionRouter.get("", collectionController.get)
collectionRouter.delete("/:collection_id", collectionController.delete)
collectionRouter.put("/:collection_id", collectionController.update)