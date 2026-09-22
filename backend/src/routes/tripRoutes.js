const express = require("express");
const pool = require("../db/db");

const router = express.Router();

async function locationBelongsToUser(locationId, userId) {
  if (!locationId) {
    return true;
  }

  const result = await pool.query(
    `
    SELECT id
    FROM locations
    WHERE id = $1
    AND user_id = $2
    `,
    [locationId, userId]
  );

  return result.rows.length > 0;
}

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        fishing_trips.*,
        locations.waterbody,
        locations.area_name
      FROM fishing_trips
      LEFT JOIN locations
        ON fishing_trips.location_id = locations.id
      WHERE fishing_trips.user_id = $1
      ORDER BY fishing_trips.start_time DESC
      `,
      [req.user.id]
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

    if (
      !(await locationBelongsToUser(
        location_id,
        req.user.id
      ))
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid location"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO fishing_trips
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
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        req.user.id,
        location_id || null,
        start_time,
        end_time || null,
        weather?.trim() || null,
        air_temperature ?? null,
        water_temperature ?? null,
        notes?.trim() || null
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

    if (
      !(await locationBelongsToUser(
        location_id,
        req.user.id
      ))
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid location"
      });
    }

    const result = await pool.query(
      `
      UPDATE fishing_trips
      SET
        location_id = $1,
        start_time = $2,
        end_time = $3,
        weather = $4,
        air_temperature = $5,
        water_temperature = $6,
        notes = $7
      WHERE id = $8
      AND user_id = $9
      RETURNING *
      `,
      [
        location_id || null,
        start_time,
        end_time || null,
        weather?.trim() || null,
        air_temperature ?? null,
        water_temperature ?? null,
        notes?.trim() || null,
        req.params.id,
        req.user.id
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
    const result = await pool.query(
      `
      DELETE FROM fishing_trips
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
        message: "Fishing trip not found"
      });
    }

    res.json({
      status: "ok",
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
