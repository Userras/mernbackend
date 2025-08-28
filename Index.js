const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/studentmanagementdata")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("DB Connection Error:", err));
const studentSchema = new mongoose.Schema({
    name : String,
    age : Number,
    department : String,
    rollNo : String
});

const Student = mongoose.model("Student", studentSchema);

app.post('/insert', verifytoken, insertdata);

app.post('/login', (req, res) => {
    let {username, password} = req.body;
    if(username == "admin" && password == "admin@123") {
        let token = jwt.sign({username}, "SECRETKEY", {
            expiresIn : '1h'
        });
        res.send(token);
    }
});


function verifytoken(req, res, next) {
    let token = req.body.token;
        if(!token) return res.send("No token provided");
        jwt.verify(token, "SECRETKEY", (err, decoded) => {
            if(err) {
                console.log(err);
                return res.send("Invalid token");
            }
            console.log(decoded);
            next();
        });
}

async function insertdata(req, res) {
    const { name, age, department, rollNo } = req.body;
    const newStudent = new Student({ name, age, department, rollNo });
    try {
        await newStudent.save();
        res.status(201).send("Student inserted");
    } catch (error) {
        res.status(400).send("Error inserting student");
    } 
}

app.get('/getAllStudents', async (req, res) => {
    try {
        const data = await Student.find();
        res.send(data);
    }
    catch (error) {
        res.status(500).send("Error fetching students");
    }
 });

 app.get('/getStudentByRollNo', async (req, res) => {
    try {
        const { rollNo } = req.body;
        const data = await Student.findOne({ rollNo });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Student not found");
        }
    }
    catch (error) {
        res.status(500).send("Error fetching students");
    }
 });

 app.get('/getStudentbyParams/:rollNo', async (req, res) => {
    try {
        const { rollNo } = req.params;
        const data = await Student.findOne({ rollNo });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Student not found");
        }
    }
    catch (error) {
        res.status(500).send("Error fetching students");
    }
 });

  app.get('/getStudentbyQuery', async (req, res) => {
    try {
        const { rollNo } = req.query;
        const data = await Student.findOne({ rollNo });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Student not found");
        }
    }
    catch (error) {
        res.status(500).send("Error fetching students");
    }
 });

 app.delete('/deleteStudentByRollNO', async (req, res) => {
    const {rollNo} = req.body;
    try {
        const deletedStudent = await Student.findOneAndDelete({rollNo})
        console.log(deletedStudent, rollNo);

        if(deletedStudent) {
            res.send("Student deleted");
        } else {
            res.status(404).send("Student not found");
        }
    }
    catch(err) {
        res.send("Error in deleting student");
    }
 });

 app.put('/updateStudent', async (req, res) => {
     const { rollNo, name, age, department } = req.body;
     try {
         const updatedStudent = await Student.findOneAndUpdate(
             { rollNo },
             { name, age, department },
             { new: true }
         );
         if (updatedStudent) {
             res.send("Student updated");
         } else {
             res.status(404).send("Student not found");
         }
     } catch (error) {
         res.status(500).send("Error updating student");
     }
 });



app.listen(3000);