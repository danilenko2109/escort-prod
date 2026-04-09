const express = require("express");
const {
  listProfiles,
  getProfileById,
  searchProfileByCode,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");
const { requireAdmin } = require("../controllers/adminController");

const router = express.Router();

router.get("/", listProfiles);
router.get("/search", searchProfileByCode);
router.get("/:id", getProfileById);
router.post("/", requireAdmin, createProfile);
router.put("/:id", requireAdmin, updateProfile);
router.delete("/:id", requireAdmin, deleteProfile);

module.exports = router;