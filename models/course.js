const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    studentName: {type: String, required: true},
    grade: {type: Number, required: true}
})

const assignmentSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    total_grade: {type: Number, required: true},
    grade: [studentSchema],
    postedBy: {type: String, required: true},
});


const courseSchema = mongoose.Schema({
    course_name: {type: String, required: true},
    standard: {type: Number, required: true},
    createdBy: {type: String, required: true},
    assignments: [assignmentSchema],
})

const Course = mongoose.model("course", courseSchema);

module.exports = Course;