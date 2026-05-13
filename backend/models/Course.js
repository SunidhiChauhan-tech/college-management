const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

  courseName: {
    type: String,
    required: true,
    unique: true
  },

  // each subject has a name + assigned teacher
  subjects: [
    {
      name: {
        type: String,
        required: true
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        default: null
      }
    }
  ],

  // students enrolled in this course
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);