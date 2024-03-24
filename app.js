const express = require("express");
const connection = require("./connection/db");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/auth");
const pdfRoutes = require("./routes/pdf");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
connection();

app.use("/api/auth", userRoutes);
app.use("/api/file", pdfRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
