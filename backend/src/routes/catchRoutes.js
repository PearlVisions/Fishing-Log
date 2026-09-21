const express = require("express");
const pool = require("../db/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         catches.*,
         fish_species.name AS species_name,
         lures.name AS lure_name,
         fishing_trips.start_time AS trip_start_time,
         locations.waterbody,
         locations.area_name
       FROM catches
       JOIN fishing_trips
         ON catches.trip_id = fishing_trips.id
       LEFT JOIN fish_species
         ON catches.species_id = fish_species.id
       LEFT JOIN lures
         ON catches.lure_id = lures.id
       LEFT JOIN locations
         ON fishing_trips.location_id = locations.id
       WHERE fishing_trips.user_id = $1
       ORDER BY catches.caught_at DESC`,
      [1]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch catches"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      trip_id,
      species_id,
      lure_id,
      caught_at,
      length_cm,
      weight_g,
      depth_m,
      released,
      notes
    } = req.body;

    if (!trip_id) {
      return res.status(400).json({
        status: "error",
        message: "Trip ID is required"
      });
    }

    const tripCheck = await pool.query(
      `SELECT id
       FROM fishing_trips
       WHERE id = $1 AND user_id = $2`,
      [trip_id, 1]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Fishing trip not found"
      });
    }

    const result = await pool.query(
      `INSERT INTO catches
       (
         trip_id,
         species_id,
         lure_id,
         caught_at,
         length_cm,
         weight_g,
         depth_m,
         released,
         notes
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        trip_id,
        species_id || null,
        lure_id || null,
        caught_at || null,
        length_cm || null,
        weight_g || null,
        depth_m || null,
        released ?? true,
        notes || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to create catch"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      species_id,
      lure_id,
      caught_at,
      length_cm,
      weight_g,
      depth_m,
      released,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE catches
       SET species_id = $1,
           lure_id = $2,
           caught_at = $3,
           length_cm = $4,
           weight_g = $5,
           depth_m = $6,
           released = $7,
           notes = $8
       WHERE id = $9
         AND trip_id IN (
           SELECT id
           FROM fishing_trips
           WHERE user_id = $10
         )
       RETURNING *`,
      [
        species_id || null,
        lure_id || null,
        caught_at || null,
        length_cm || null,
        weight_g || null,
        depth_m || null,
        released ?? true,
        notes || null,
        id,
        1
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Catch not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to update catch"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM catches
       WHERE id = $1
         AND trip_id IN (
           SELECT id
           FROM fishing_trips
           WHERE user_id = $2
         )
       RETURNING *`,
      [id, 1]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Catch not found"
      });
    }

    res.json({
      status: "ok",
      message: "Catch deleted",
      catch: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete catch"
    });
  }
});

module.exports = router;
