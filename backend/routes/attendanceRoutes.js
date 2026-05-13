const express = require("express");
const router  = express.Router();

const {
  markAttendance,
  getMySubjectAttendance,
  getAttendanceSummary,
  getMyAttendance,
  getAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ── Teacher routes ──

// POST /attendance/mark
// teacher marks attendance for their subject's students
router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("teacher"),
  markAttendance
);

// GET /attendance/my-subject?date=YYYY-MM-DD
// teacher sees today's (or any date's) attendance for their subject
router.get(
  "/my-subject",
  authMiddleware,
  roleMiddleware("teacher"),
  getMySubjectAttendance
);

// GET /attendance/summary
// teacher sees each student's overall attendance % for their subject
router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("teacher"),
  getAttendanceSummary
);

// ── Student route ──

// GET /attendance/me
// student sees their own attendance % per subject
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("student"),
  getMyAttendance
);

// ── Admin route ──

// GET /attendance
// admin sees all attendance records
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAttendance
);

module.exports = router;