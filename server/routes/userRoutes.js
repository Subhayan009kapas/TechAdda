const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// New search route
router.get("/", authMiddleware, searchUsers);

module.exports = router;
