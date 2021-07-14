import express from "express";
import collectionController from "../controller/CollectionController";

export const collectionRouter = express.Router();

collectionRouter.post("/create", collectionController.create);
collectionRouter.get("", collectionController.get)

