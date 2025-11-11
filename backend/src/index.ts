import { App } from "./infrastructure/server/app";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = new App();
const expressApp = app.getExpressApp();

expressApp.listen(PORT, () => {
  console.log("🚀 FuelEU Backend running on http://localhost:" + PORT);
  console.log("📊 Health check: http://localhost:" + PORT + "/health");
});
