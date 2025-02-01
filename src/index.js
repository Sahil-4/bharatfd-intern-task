import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import connectDB from "./db/connect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../", "public")));
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "../", "node_modules", "tinymce")),
);

// handle api routes here

// starting the server and db
(async () => {
  try {
    app.listen(PORT);
    await connectDB();
    console.log(`listening at http://localhost:${PORT}`);
  } catch (error) {
    console.error(`error starting server: ${error}`);
    process.exit(1);
  }
})();
