const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(express.json());

// MONGO URI
const URI = "mongodb://localhost:27017/aggregate"

// Mongoose connection
const connectionObject = mongoose.createConnection(URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Student Schema
const studentSchema = new mongoose.Schema({
	name: { type: String },
	age: { type: Number },
	roll_number: { type: Number },
});

const Student = connectionObject.model('Student', studentSchema);

// Class Schema
const classSchema = new mongoose.Schema({
	standard: { type: Number },
	section: { type: String },
	class_id: { type: Number }
});

const Class = connectionObject.model('Class', classSchema);

// Create Student
app.post('/create-student', async (req, res) => {
	try {
		const student = await Student.create(req.body);
		res.json(student);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Create Class
app.post('/create-class', async (req, res) => {
	try {
		const newClass = await Class.create(req.body);
		res.json(newClass);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get students when condition matches
app.get('/get-students-by-match', async (req, res) => {
	try {
		const students = await Student.aggregate([{ $match: { age: { $gt: 14 } } }, { $limit: 1 }])
		res.json(students);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get students by project
app.get('/get-students-by-project', async (req, res) => {
	try {
		const students = await Student.aggregate([{ $project: { name: 1, roll_number: 1, _id: 0 } }])
		res.json(students);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get total students count
app.get('/get-students-count', async (req, res) => {
	try {
		const studentsCount = await Student.aggregate([{ $count: "students_count" }])
		res.json(studentsCount);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get sorted list of students
app.get('/get-students-sort', async (req, res) => {
	try {
		const students = await Student.aggregate([{ $sort: { "name": 1 } }])
		res.json(students);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Group students age by group
app.get('/group-students', async (req, res) => {
	try {
		const students = await Student.aggregate([{ $group: { _id: null, total_age: { $sum: "$age" } } }])
		res.json(students);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Combine classes collection with students collection
app.get('/students-with-class', async (req, res) => {
	try {
		const result = await Student.aggregate([{ $lookup: { from: "classes", localField: "roll_number", foreignField: "class_id", as: "class_details" } }]).exec();
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});