// server/routes/api.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Fetch all districts
router.get("/districts", (req, res) => {
  const query = "SELECT * FROM districts";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching districts:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json(results);
  });
});

// ✅ Example route: fetch single district by ID
router.get("/districts/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM districts WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching district:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "District not found" });
    }

    res.status(200).json(results[0]);
  });
});

export default router;
