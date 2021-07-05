import dotenv from "dotenv";
import { AddressInfo } from "net";
import express from "express";
import { userRouter } from "./routes/UserRouter";
import { photoRouter } from "./routes/PhotoRouter";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/user", userRouter);
app.use("/photo", photoRouter);

const server = app.listen(4000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server running at http://localhost:${address.port}`);
  } else {
    console.error(`Failed to run server.`);
  }
});
