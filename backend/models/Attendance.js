const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  //  course is now optional — not required to mark attendance
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  // subject string matching teacher.subject e.g. "Python"
  subject: {
    type: String,
    required: true
  },

  // teacher who marked this
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },

  // "YYYY-MM-DD" string for easy date comparison
  date: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["present", "absent"],
    required: true
  }

}, { timestamps: true });

//  unique per student per subject per date — prevents duplicates
attendanceSchema.index(
  { student: 1, subject: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);