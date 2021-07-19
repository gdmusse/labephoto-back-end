import dotenv from "dotenv";
import { AddressInfo } from "net";
import express from "express";
import { userRouter } from "./routes/UserRouter";
import { photoRouter } from "./routes/PhotoRouter";
import cors from "cors";
import { collectionRouter } from "./routes/CollectionRouter";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:3000" }));

app.use(express.json());

app.use("/user", userRouter);
app.use("/photo", photoRouter);
app.use("/collection", collectionRouter);

var port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server running at http://localhost:${address.port}`);
  } else {
    console.error(`Failed to run server.`);
  }
});
