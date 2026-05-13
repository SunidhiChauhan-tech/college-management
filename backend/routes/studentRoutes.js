const express = require("express");
const router  = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createStudent,
  getStudents,
  getMyStudents,
  updateStudent,
  deleteStudent,
  registerStudent,
  loginStudent,
  getMyProfile,
  enrollSubjects,
  updateAttendance
} = require("../controllers/studentController");

// ── Public ──
router.post("/register", registerStudent);
router.post("/login",    loginStudent);

// ── Named routes BEFORE /:id ──
router.get("/me",         authMiddleware, getMyProfile);
router.put("/enroll",     authMiddleware, roleMiddleware("student"), enrollSubjects);
router.get("/my-students",authMiddleware, roleMiddleware("teacher"), getMyStudents);
router.get("/all",        authMiddleware, roleMiddleware("admin", "teacher"), getStudents);
router.get("/",           authMiddleware, roleMiddleware("admin"), getStudents);

// ── ID routes ──
router.put("/:id",            authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:id",         authMiddleware, roleMiddleware("admin"), deleteStudent);
router.put("/:id/attendance", authMiddleware, roleMiddleware("teacher"), updateAttendance);

module.exports = router;