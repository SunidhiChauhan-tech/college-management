require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();

//  MIDDLEWARES
app.use(cors()); //  VERY IMPORTANT
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});