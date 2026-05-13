const express = require("express");
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getMe,
  updateTeacher,
  deleteTeacher,
  registerTeacher,
  loginTeacher
} = require("../controllers/teacherController");

const verifyToken = require("../middleware/authMiddleware");

// ── Public routes (no token needed) ──
router.post("/register", registerTeacher);
router.post("/login",    loginTeacher);
router.post("/add",      createTeacher);
router.get("/",          getTeachers);

// ── Protected routes (token required) ──
//  IMPORTANT: /me must be BEFORE /:id so Express doesn't treat "me" as an id
router.get("/me", verifyToken, getMe);

router.put("/:id",    updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;