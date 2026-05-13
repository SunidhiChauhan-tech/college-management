const Course  = require("../models/Course");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const { courseName } = req.body;
    if (!courseName) return res.status(400).json({ message: "Course name required" });

    const existing = await Course.findOne({ courseName });
    if (existing) return res.status(400).json({ message: "Course already exists" });

    const course = new Course({ courseName });
    await course.save();
    res.json({ message: "Course created", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COURSES (with subjects + teacher populated)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("subjects.teacher", "name email subject")
      .populate("students", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD SUBJECT TO COURSE
// POST /courses/add-subject
// body: { courseId, subjectName }
exports.addSubjectToCourse = async (req, res) => {
  try {
    const { courseId, subjectName } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const exists = course.subjects.some(
      s => s.name.toLowerCase() === subjectName.toLowerCase()
    );
    if (exists) return res.status(400).json({ message: "Subject already exists" });

    course.subjects.push({ name: subjectName, teacher: null });
    await course.save();

    const updated = await Course.findById(courseId)
      .populate("subjects.teacher", "name email subject");

    res.json({ message: "Subject added", course: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE SUBJECT FROM COURSE
// DELETE /courses/remove-subject
// body: { courseId, subjectName }
exports.removeSubjectFromCourse = async (req, res) => {
  try {
    const { courseId, subjectName } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.subjects = course.subjects.filter(
      s => s.name.toLowerCase() !== subjectName.toLowerCase()
    );
    await course.save();

    const updated = await Course.findById(courseId)
      .populate("subjects.teacher", "name email subject");

    res.json({ message: "Subject removed", course: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN TEACHER TO SUBJECT
// PUT /courses/assign-subject-teacher
// body: { courseId, subjectName, teacherId }
exports.assignTeacherToSubject = async (req, res) => {
  try {
    const { courseId, subjectName, teacherId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const idx = course.subjects.findIndex(
      s => s.name.toLowerCase() === subjectName.toLowerCase()
    );
    if (idx === -1) return res.status(404).json({ message: "Subject not found" });

    course.subjects[idx].teacher = teacherId || null;
    await course.save();

    // update teacher.subject to match
    if (teacherId) {
      await Teacher.findByIdAndUpdate(teacherId, { subject: subjectName });
    }

    const updated = await Course.findById(courseId)
      .populate("subjects.teacher", "name email subject");

    res.json({ message: "Teacher assigned", course: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN COURSE TO STUDENT
// PUT /courses/assign-student
// body: { studentId, courseName }
exports.assignCourseToStudent = async (req, res) => {
  try {
    const { studentId, courseName } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { course: courseName, subjects: [] },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Course assigned", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD STUDENT TO COURSE
exports.addStudentToCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};