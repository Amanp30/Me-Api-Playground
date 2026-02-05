import mongoose from "mongoose";
import app from "../app.js";
import { MONGO_URI, PORT } from "../src/config/env_vars.js";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.info("db connnected");

    app.listen(PORT, () => {
      console.info(
        `Server is running on port ${PORT}`,
        `check http://localhost:${PORT}/api`,
      );
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

main();
