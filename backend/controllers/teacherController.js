const Teacher = require("../models/Teacher");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");

// CREATE
exports.createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json({ message: "Teacher created", teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware (works for both teacher and student)
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).select("-password");
    res.json({ message: "Teacher updated", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTER
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name, email,
      password: hashedPassword,
      subject:  subject || "General",
      role:     "teacher"
    });

    await teacher.save();

    const teacherObj = teacher.toObject();
    delete teacherObj.password;

    res.json({ message: "Teacher registered successfully", teacher: teacherObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: teacher._id, role: teacher.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};