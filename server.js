const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Path to students.json
const dataFile = path.join(__dirname, "data", "students.json");

// Utility to read file
function readStudents() {
  if (!fs.existsSync(dataFile)) return [];
  const data = fs.readFileSync(dataFile, "utf8");
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Utility to write file
function writeStudents(students) {
  fs.writeFileSync(dataFile, JSON.stringify(students, null, 2));
}

// Task 1: Add a new student
app.post("/api/students", (req, res) => {
  const { name, age, course, year, status } = req.body;

  // Validation
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Name, course, and year are required." });
  }
  if (typeof age !== "number" || age <= 0) {
    return res.status(400).json({ error: "Age must be a number greater than 0." });
  }

  const students = readStudents();

  const newStudent = {
    id: uuidv4(),
    name,
    age,
    course,
    year,
    status: status || "active"
  };

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// Task 2: Get all students
app.get("/api/students", (req, res) => {
  try {
    const students = readStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Could not read students data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
