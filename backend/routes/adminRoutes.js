const express = require("express");
const { adminLogin, getAdminMe, getAdminStats, requireAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", requireAdmin, getAdminMe);
router.get("/stats", requireAdmin, getAdminStats);

module.exports = router;