import { createApp } from "./app.js";

const PORT = process.env.PORT || 4000;import dotenv from "dotenv";
dotenv.config();

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
