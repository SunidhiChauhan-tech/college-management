// Run this ONCE from your backend folder:
// node createAdmin.js

require("dotenv").config();
const bcrypt    = require("bcrypt");
const Student   = require("./models/Student");
const connectDB = require("./config/db");

const createAdmin = async () => {
  await connectDB();

  // remove any old admin first
  await Student.deleteOne({ role: "admin" });

  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = new Student({
    name:     "Admin",
    email:    "admin@gmail.com",
    password: hashedPassword,
    role:     "admin",
    course:   ""
  });

  await admin.save();
  console.log(" Admin created successfully!");
  console.log("   Email:    admin@gmail.com");
  console.log("   Password: 123456");
  process.exit(0);
};

createAdmin().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});