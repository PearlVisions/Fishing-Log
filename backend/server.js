require("dotenv").config();
7777
const express = require("express");
const cors = require("cors");
const pool = require("./src/db/db");
const locationRoutes = require("./src/routes/locationRoutes");
const speciesRoutes = require("./src/routes/speciesRoutes");
const lureRoutes = require("./src/routes/lureRoutes");
const tripRoutes = require("./src/routes/tripRoutes");
const catchRoutes = require("./src/routes/catchRoutes");
const authRoutes = require("./src/routes/authRoutes");
const authMiddleware = require("./src/middleware/authMiddleware");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(
  "/api/locations",
  authMiddleware,
  locationRoutes
);

app.use(
  "/api/lures",
  authMiddleware,
  lureRoutes
);

app.use(
  "/api/trips",
  authMiddleware,
  tripRoutes
);

app.use(
  "/api/catches",
  authMiddleware,
  catchRoutes
);

app.use(
  "/api/species",
  authMiddleware,
  speciesRoutes
);



app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Fishing Log API is running"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      databaseTime: result.rows[0].now
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
