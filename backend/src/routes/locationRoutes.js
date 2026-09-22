const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM locations
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
      message: "Failed to fetch locations"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      waterbody,
      area_name,
      notes
    } = req.body;

    if (!waterbody?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Waterbody is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO locations
      (
        user_id,
        waterbody,
        area_name,
        notes
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        req.user.id,
        waterbody.trim(),
        area_name?.trim() || null,
        notes?.trim() || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to create location"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      waterbody,
      area_name,
      notes
    } = req.body;

    if (!waterbody?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Waterbody is required"
      });
    }

    const result = await pool.query(
      `
      UPDATE locations
      SET
        waterbody = $1,
        area_name = $2,
        notes = $3
      WHERE id = $4
      AND user_id = $5
      RETURNING *
      `,
      [
        waterbody.trim(),
        area_name?.trim() || null,
        notes?.trim() || null,
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Location not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to update location"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM locations
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
        message: "Location not found"
      });
    }

    res.json({
      status: "ok",
      location: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete location"
    });
  }
});

module.exports = router;
