import mongoose from "mongoose";
import { env } from "./env.config.js";

class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const mongooseConnectionInstance = await mongoose.connect(env.DATABASE_URL);
    console.log(
      "Database connection success!",
      mongooseConnectionInstance.connection.host,
      mongooseConnectionInstance.connection.name,
    );
  }
}

export default Database.getInstance();
