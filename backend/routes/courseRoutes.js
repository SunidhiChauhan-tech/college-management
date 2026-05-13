const express = require("express");
const router  = express.Router();

const {
  createCourse,
  getCourses,
  deleteCourse,
  addSubjectToCourse,
  removeSubjectFromCourse,
  assignTeacherToSubject,
  assignCourseToStudent,
  addStudentToCourse
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/",                        getCourses);
router.post("/add",                    authMiddleware, roleMiddleware("admin"), createCourse);
router.post("/add-subject",            authMiddleware, roleMiddleware("admin"), addSubjectToCourse);
router.delete("/remove-subject",       authMiddleware, roleMiddleware("admin"), removeSubjectFromCourse);
router.put("/assign-subject-teacher",  authMiddleware, roleMiddleware("admin"), assignTeacherToSubject);
router.put("/assign-student",          authMiddleware, roleMiddleware("admin"), assignCourseToStudent);
router.post("/add-student",            addStudentToCourse);
router.delete("/:id",                  authMiddleware, roleMiddleware("admin"), deleteCourse);

module.exports = router;