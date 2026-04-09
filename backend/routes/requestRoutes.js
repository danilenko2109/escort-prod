const express = require("express");
const { submitBookingRequest } = require("../controllers/requestController");

const router = express.Router();

router.post("/", submitBookingRequest);

module.exports = router;