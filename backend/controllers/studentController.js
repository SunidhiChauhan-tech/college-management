const Student = require("../models/Student");
const Course  = require("../models/Course");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");

// ── CREATE (admin adds student — password hashed so they can login) ──
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      course:   course || "",
      role:     "student"
    });

    await student.save();

    const studentObj = student.toObject();
    delete studentObj.password;

    res.status(201).json({ message: "Student created", student: studentObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET ALL (admin) ──
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: { $ne: "admin" } }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET MY STUDENTS (teacher) ──
// finds students enrolled in teacher's subject via Course.subjects
exports.getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const course = await Course.findOne({ "subjects.teacher": teacherId });
    if (!course) return res.json([]);

    const teacherSubjects = course.subjects
      .filter(s => s.teacher?.toString() === teacherId.toString())
      .map(s => s.name);

    if (teacherSubjects.length === 0) return res.json([]);

    const students = await Student.find({
      subjects: { $in: teacherSubjects }
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── UPDATE ──
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).select("-password");
    res.json({ message: "Student updated", updatedStudent: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── DELETE ──
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── REGISTER (self-register from login page) ──
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name, email,
      password: hashedPassword,
      course:   "",
      role:     "student"
    });
    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── LOGIN ──
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: student._id, role: student.role || "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id:    student._id,
        name:  student.name,
        email: student.email,
        role:  student.role || "student"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET MY PROFILE ──
exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── ENROLL IN SUBJECTS ──
exports.enrollSubjects = async (req, res) => {
  try {
    const { subjects, course } = req.body;
 
    const updateData = { subjects };
    // also update course if provided
    if (course) updateData.course = course;
 
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");
 
    res.json({ message: "Subjects enrolled", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── UPDATE ATTENDANCE ──
exports.updateAttendance = async (req, res) => {
  try {
    const { subject, percentage } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const idx = student.attendance?.findIndex(a => a.subject === subject);
    if (idx > -1) {
      student.attendance[idx].percentage = percentage;
    } else {
      student.attendance.push({ subject, percentage });
    }
    await student.save();
    res.json({ message: "Attendance updated", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};