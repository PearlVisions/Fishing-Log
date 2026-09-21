const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM fish_species ORDER BY name ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch fish species"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Species name is required"
      });
    }

    const result = await pool.query(
      `INSERT INTO fish_species (name)
       VALUES ($1)
       RETURNING *`,
      [name.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to create fish species"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Species name is required"
      });
    }

    const result = await pool.query(
      `UPDATE fish_species
       SET name = $1
       WHERE id = $2
       RETURNING *`,
      [name.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Species not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to update fish species"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM fish_species
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Species not found"
      });
    }

    res.json({
      status: "ok",
      message: "Species deleted",
      species: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete fish species"
    });
  }
});

module.exports = router;
