import dotenv from "dotenv";
import { AddressInfo } from "net";
import express from "express";
import { userRouter } from "./routes/UserRouter";
import { photoRouter } from "./routes/PhotoRouter";
import cors from "cors";
import { collectionRouter } from "./routes/CollectionRouter";
import { join } from "path";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:3000" }));

app.use(express.json());

const static_dir =
  process.env.STATIC_DIR || join("..", "labephoto-front-end", "build");

app.use(express.static(join(static_dir)));

app.get("/", function (req, res) {
  res.sendFile(join(static_dir, "index.html"));
});

app.use("/user", userRouter);
app.use("/photo", photoRouter);
app.use("/collection", collectionRouter);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server running at http://localhost:${address.port}`);
  } else {
    console.error(`Failed to run server.`);
  }
});
