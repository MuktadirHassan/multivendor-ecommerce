import express from "express";
import { handleGlobalError } from "./utils/Error";

const app = express();

import productRoutes from "./routes/product.routes";

app.get("/", (req, res) => {
  res.status(200);
});

app.use("/api/products", productRoutes);

app.use(handleGlobalError);

export default app;
