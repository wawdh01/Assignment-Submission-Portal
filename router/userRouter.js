const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//login
router.get('/login', (req, res)=>{
    res.render('login', {});
})

router.post('/login', async (req, res)=>{
    const {mbNum, password} = req.body;
    const existingUser = await User.findOne({mbNum});
        //console.log(existingUser);
        //const existingUser = await Login.find({email});
    if (!existingUser) {
        return res.status(401).json({errorMessage: "Email or Password is Wrong."});
    }
    const passwordCorrect = (password === existingUser.password) ? true:false;
    if (!passwordCorrect) {
        return res.status(401).json({errorMessage: "Email or Password is Wrong."});
    }

    //Sign in the user
    const token = jwt.sign({
        user : existingUser._id,
    }, process.env.JWT_SECRET);

    //send a token in HTTP-cookie only
    res.cookie("token", token, {
        httpOnly: true,
    });
    res.redirect('/user/dashboard');

})

//register
router.get('/register', auth, (req, res)=>{
    res.render('register', {});
})

router.post('/register', auth, async (req, res)=>{
    const {name, mbNum, standard, password, login_type} = req.body;
    const newUser = new User({
        name, mbNum, standard, password, login_type
    });
    const saveUser = await newUser.save();
    res.redirect('/user/login');
})


//dashboard
router.get('/dashboard', auth, (req, res)=>{
    res.render('dashboard');
})


//Login Type
router.get('/logintype', auth, async (req, res)=>{
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({errorMessage:"Unauthorized"});
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const _id = verified.user;
        const existingUser = await User.findOne({_id});
        res.send(existingUser);
    }
    catch(e) {
        console.log(e);
        res.status(500).send();
    }
})


module.exports = router;
