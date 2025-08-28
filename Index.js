const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const db = require('./db');

app.use(express.json());

db();

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    department: String,
    rollNo: String
});
const Student = mongoose.model("Student", studentSchema);

function verifyToken(req, res, next) {
    let token = req.body.token;
    if (!token) return res.send("No token provided");
    jwt.verify(token, "SECRETKEY", (err, decoded) => {
        if (err) return res.send("Invalid token");
        console.log(decoded);
        next();
    });
}

async function login(req, res) {
    let { username, password } = req.body;
    if (username == "admin" && password == "admin@123") {
        let token = jwt.sign({ username }, "SECRETKEY", { expiresIn: '1h' });
        res.send(token);
    } else {
        res.status(401).send("Invalid credentials");
    }
}

async function insertStudent(req, res) {
    const { name, age, department, rollNo } = req.body;
    const newStudent = new Student({ name, age, department, rollNo });
    try {
        await newStudent.save();
        res.status(201).send("Student inserted");
    } catch (error) {
        res.status(400).send("Error inserting student");
    }
}

async function getAllStudents(req, res) {
    try {
        const data = await Student.find();
        res.send(data);
    } catch (error) {
        res.status(500).send("Error fetching students");
    }
}

async function getStudentByRollNo(req, res) {
    try {
        const { rollNo } = req.body;
        const data = await Student.findOne({ rollNo });
        if (data) res.send(data);
        else res.status(404).send("Student not found");
    } catch (error) {
        res.status(500).send("Error fetching student");
    }
}

async function getStudentByParams(req, res) {
    try {
        const { rollNo } = req.params;
        const data = await Student.findOne({ rollNo });
        if (data) res.send(data);
        else res.status(404).send("Student not found");
    } catch (error) {
        res.status(500).send("Error fetching student");
    }
}

async function getStudentByQuery(req, res) {
    try {
        const { rollNo } = req.query;
        const data = await Student.findOne({ rollNo });
        if (data) res.send(data);
        else res.status(404).send("Student not found");
    } catch (error) {
        res.status(500).send("Error fetching student");
    }
}

async function deleteStudentByRollNo(req, res) {
    const { rollNo } = req.body;
    try {
        const deletedStudent = await Student.findOneAndDelete({ rollNo });
        if (deletedStudent) res.send("Student deleted");
        else res.status(404).send("Student not found");
    } catch (err) {
        res.status(500).send("Error deleting student");
    }
}

async function updateStudent(req, res) {
    const { rollNo, name, age, department } = req.body;
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { rollNo },
            { name, age, department },
            { new: true }
        );
        if (updatedStudent) res.send("Student updated");
        else res.status(404).send("Student not found");
    } catch (error) {
        res.status(500).send("Error updating student");
    }
}

app.post('/login', login);
app.post('/insert', insertStudent);
app.get('/getAllStudents',verifyToken,  getAllStudents);
app.get('/getStudentByRollNo', verifyToken, getStudentByRollNo);
app.get('/getStudentbyParams/:rollNo', verifyToken, getStudentByParams);
app.get('/getStudentbyQuery', verifyToken, getStudentByQuery);
app.delete('/deleteStudentByRollNO', verifyToken, deleteStudentByRollNo);
app.put('/updateStudent', verifyToken, updateStudent);

app.listen(3000, () => console.log("Server running on port 3000"));