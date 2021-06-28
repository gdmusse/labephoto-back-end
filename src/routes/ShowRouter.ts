import express from "express";
import showController from "../controller/ShowController";

export const showRouter = express.Router();

showRouter.post("/add", showController.add);
showRouter.get("/:week_day", showController.getShowsByDay);
