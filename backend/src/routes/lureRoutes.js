const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM lures
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch lures"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      manufacturer,
      color,
      length_mm,
      weight_g
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Lure name is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO lures
      (
        user_id,
        name,
        type,
        manufacturer,
        color,
        length_mm,
        weight_g
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        req.user.id,
        name.trim(),
        type?.trim() || null,
        manufacturer?.trim() || null,
        color?.trim() || null,
        length_mm || null,
        weight_g || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to create lure"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      type,
      manufacturer,
      color,
      length_mm,
      weight_g
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Lure name is required"
      });
    }

    const result = await pool.query(
      `
      UPDATE lures
      SET
        name = $1,
        type = $2,
        manufacturer = $3,
        color = $4,
        length_mm = $5,
        weight_g = $6
      WHERE id = $7
      AND user_id = $8
      RETURNING *
      `,
      [
        name.trim(),
        type?.trim() || null,
        manufacturer?.trim() || null,
        color?.trim() || null,
        length_mm || null,
        weight_g || null,
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Lure not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to update lure"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM lures
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Lure not found"
      });
    }

    res.json({
      status: "ok",
      lure: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete lure"
    });
  }
});

module.exports = router;
