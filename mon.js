const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/StudentDB")
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log("DB Connection Error!!!", err));
const StudentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    dept: String,
    rollno: String
});
const Student = mongoose.model("Student", StudentSchema);
// Insert Student
app.post('/insert', async (req, res) => {
    const { name, age, dept, rollno } = req.body;
    try {
        const newStudent = new Student({ name, age, dept, rollno });
        await newStudent.save();
        res.status(201).send("Student inserted successfully");
    } catch (err) {
        console.error("Error inserting student:", err);
        res.status(500).send("Error inserting student");
    }
});
// Get all students
app.get('/getAllStudents', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).send("Error fetching students!!!!");
    }
});
// Get student by roll number
app.get('/getStudentByprams/rollno', async (req, res) => {
    try {
        const student = await Student.findOne({ rollno: req.params.rollno });
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).send("Student not found!!");
        }
    } catch (error) {
        res.status(500).send("Error fetching student!!!!");
    }        
});
app.delete('/deleteStudentByRollNo/:rollno', async (req, res) => {
    const rollno = req.params.rollno;
    try {
        const result = await Student.deleteOne({ rollno: rollno });

        if (result.deletedCount > 0) {
            res.send("Student deleted successfully");
        } else {
            res.status(404).send("Student not found");
        }
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).send("Error deleting student!!!");
    }
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});