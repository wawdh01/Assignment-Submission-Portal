const router = require('express').Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.get('/mycourses', auth, async (req, res)=>{
    const courses = await Course.find();
    res.render('courses', {courses});
})

router.get('/createcourse', auth, (req, res)=>{
    res.render('createCourse', {});
})

router.post('/createcoursepost', auth, async(req, res)=>{
    const {course_name, standard} = req.body;
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({errorMessage:"Unauthorized"});
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const _id = verified.user;
    const existingUser = await User.findOne({_id});
    const createdBy = existingUser.name;
    const newCourse = new Course({
        course_name,
        standard,
        createdBy
    });
    await newCourse.save();
    res.redirect('/course/mycourses');
})

router.get('/:id', auth, async (req, res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    console.log(course);
    res.render('singleCourse', {course});
})

router.get('/createassignment/:id',auth, async(req, res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render('createAssignment', {course});
})

router.post('/createassignmentpost/:id', auth, async(req, res)=>{
    const {id} = req.params;
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({errorMessage:"Unauthorized"});
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const _id = verified.user;
    const existingUser = await User.findOne({_id});
    const postedBy = existingUser.name;
    const {title, description, total_grade} = req.body;
    const assignmentBody = {
        title,
        description,
        total_grade,
        postedBy
    }
    const course = await Course.findByIdAndUpdate(
        {_id: id},
        {$addToSet:{assignments: assignmentBody}},
        function (err, result) {
            if (err) {
                res.send(err);
            }
        }
    );
    res.redirect('/course/' + course._id);
})


module.exports = router;