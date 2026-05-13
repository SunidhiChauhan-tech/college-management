const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  role: {
    type: String,
    default: "teacher"
  },
   password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);