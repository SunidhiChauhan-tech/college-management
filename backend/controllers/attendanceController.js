const Attendance = require("../models/Attendance");
const Student    = require("../models/Student");
const Teacher    = require("../models/Teacher");

const todayStr = () => new Date().toISOString().split("T")[0];

// ── MARK ATTENDANCE (teacher) ──
exports.markAttendance = async (req, res) => {
  try {
    const { records, date } = req.body;
    const teacherId   = req.user.id;
    const attendanceDate = date || todayStr();

    // get teacher's subject — this is all we need
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ message: "No records provided" });
    }

    const subject  = teacher.subject;
    const markedBy = teacherId;
    const saved    = [];
    const errors   = [];

    for (const record of records) {
      try {
        // upsert — safe against duplicates
        const result = await Attendance.findOneAndUpdate(
          {
            student: record.studentId,
            subject,
            date:    attendanceDate
          },
          {
            student:  record.studentId,
            subject,
            markedBy,
            date:     attendanceDate,
            status:   record.status,
            // course is optional — only set if provided
            ...(record.courseId ? { course: record.courseId } : {})
          },
          {
            upsert:              true,
            new:                 true,
            setDefaultsOnInsert: true
          }
        ).populate("student", "name email");

        saved.push(result);

      } catch (err) {
        errors.push({ studentId: record.studentId, error: err.message });
      }
    }

    res.json({
      message: `Attendance marked for ${saved.length} students`,
      date:    attendanceDate,
      subject,
      saved,
      errors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── GET ATTENDANCE FOR TEACHER'S SUBJECT ON A DATE ──
exports.getMySubjectAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const date      = req.query.date || todayStr();

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const records = await Attendance.find({
      subject: teacher.subject,
      date
    }).populate("student", "name email");

    res.json({ date, subject: teacher.subject, records });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── ATTENDANCE SUMMARY — % per student for teacher's subject ──
exports.getAttendanceSummary = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const subject = teacher.subject;

    // get all students enrolled in this subject
    const students = await Student.find({ subjects: subject }).select("name email");

    const summary = await Promise.all(
      students.map(async (student) => {
        const total   = await Attendance.countDocuments({ student: student._id, subject });
        const present = await Attendance.countDocuments({ student: student._id, subject, status: "present" });
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        return {
          student:    { _id: student._id, name: student.name, email: student.email },
          total,
          present,
          absent:     total - present,
          percentage
        };
      })
    );

    res.json({ subject, summary });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── GET MY ATTENDANCE (student) ──
exports.getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select("subjects");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceBySubject = await Promise.all(
      (student.subjects || []).map(async (subject) => {
        const total   = await Attendance.countDocuments({ student: studentId, subject });
        const present = await Attendance.countDocuments({ student: studentId, subject, status: "present" });
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        const recent = await Attendance.find({ student: studentId, subject })
          .sort({ date: -1 })
          .limit(10)
          .select("date status");

        return { subject, total, present, absent: total - present, percentage, recent };
      })
    );

    res.json(attendanceBySubject);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── GET ALL ATTENDANCE (admin) ──
exports.getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("student",  "name email")
      .populate("course",   "courseName")
      .populate("markedBy", "name subject")
      .sort({ date: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};