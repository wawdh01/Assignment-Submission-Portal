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


module.exports = router;