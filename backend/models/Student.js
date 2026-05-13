const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // which course the student is in e.g. "BCA"
  course: {
    type: String
  },

  // ✅ subjects the student has chosen
  // e.g. ["Python", "Math", "DSA"]
  // these are plain strings matching teacher.subject
  subjects: [
    {
      type: String
    }
  ],

  // ✅ attendance percentage per subject
  // e.g. [{ subject: "Python", percentage: 85 }]
  attendance: [
    {
      subject: {
        type: String
      },
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      }
    }
  ],

  role: {
    type: String,
    default: "student"
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);