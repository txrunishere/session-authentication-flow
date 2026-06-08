import app from "./app.js";
import db from "./config/db.js";
import { env } from "./config/env.config.js";

const PORT = env.PORT || 8000;

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
