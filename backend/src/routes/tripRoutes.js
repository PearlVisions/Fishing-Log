const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         fishing_trips.*,
         locations.waterbody,
         locations.area_name
       FROM fishing_trips
       LEFT JOIN locations
         ON fishing_trips.location_id = locations.id
       WHERE fishing_trips.user_id = $1
       ORDER BY fishing_trips.start_time DESC`,
      [1]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch fishing trips"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      location_id,
      start_time,
      end_time,
      weather,
      air_temperature,
      water_temperature,
      notes
    } = req.body;

    if (!start_time) {
      return res.status(400).json({
        status: "error",
        message: "Start time is required"
      });
    }

    const result = await pool.query(
      `INSERT INTO fishing_trips
       (
         user_id,
         location_id,
         start_time,
         end_time,
         weather,
         air_temperature,
         water_temperature,
         notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        1,
        location_id || null,
        start_time,
        end_time || null,
        weather || null,
        air_temperature || null,
        water_temperature || null,
        notes || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to create fishing trip"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      location_id,
      start_time,
      end_time,
      weather,
      air_temperature,
      water_temperature,
      notes
    } = req.body;

    if (!start_time) {
      return res.status(400).json({
        status: "error",
        message: "Start time is required"
      });
    }

    const result = await pool.query(
      `UPDATE fishing_trips
       SET location_id = $1,
           start_time = $2,
           end_time = $3,
           weather = $4,
           air_temperature = $5,
           water_temperature = $6,
           notes = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        location_id || null,
        start_time,
        end_time || null,
        weather || null,
        air_temperature || null,
        water_temperature || null,
        notes || null,
        id,
        1
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Fishing trip not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to update fishing trip"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM fishing_trips
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, 1]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Fishing trip not found"
      });
    }

    res.json({
      status: "ok",
      message: "Fishing trip deleted",
      trip: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete fishing trip"
    });
  }
});

module.exports = router;
