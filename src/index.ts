import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

import { app } from "./app";

// port
const PORT = 8000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
