const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      display_name
    } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Email is already registered"
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        email,
        password_hash,
        display_name
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        email,
        display_name
      `,
      [
        normalizedEmail,
        passwordHash,
        display_name?.trim() || null
      ]
    );

    const user = result.rows[0];

    res.status(201).json({
      token: createToken(user),
      user
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Registration failed"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT
        id,
        email,
        display_name,
        password_hash
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    res.json({
      token: createToken(user),

      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Login failed"
    });
  }
});

router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          id,
          email,
          display_name
        FROM users
        WHERE id = $1
        `,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "User not found"
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: "error",
        message: "Failed to load user"
      });
    }
  }
);

module.exports = router;
