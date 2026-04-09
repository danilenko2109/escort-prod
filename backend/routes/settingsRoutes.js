const express = require("express");
const { requireAdmin } = require("../controllers/adminController");
const { getBookingPhone, updateBookingPhone } = require("../controllers/settingsController");

const router = express.Router();

router.get("/booking-phone", getBookingPhone);
router.put("/booking-phone", requireAdmin, updateBookingPhone);

module.exports = router;
