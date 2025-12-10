import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5)",
      [name, email, hashed, address, role]
    );

    return res.json({ message: "User registered successfully" });
  } catch (err) {
  console.error("REGISTER ERROR:", err); 
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
  console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
