const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require('../validation') //module object

//REGISTER
router.post('/register', async (req, res) => {

    // validate the data format
    const { error } = registerValidation(req.body)
    if (error) res.status(400).json(error.details[0].message) //if got error ,skip the rest

    //check if email exists in database
    const emailExisted = await User.findOne({ email: req.body.email })
    if (emailExisted) res.status(400).json("email exists!") //if exists, skill the rest

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //add new user
    const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
    });

    try {

        //save user to DB
        const savedUser = await user.save();
        res.json({ id: user._id })

    } catch (err) {
        res.status(400).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res) => {

    // validate the data format
    const { error } = loginValidation(req.body)
    if (error) return res.status(401).json(error.details[0].message) //if got error ,skip the rest

    //check if email exists in database
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(401).json({ message: "Incorrect email and/or password" }) //if exists, skill the rest

    //validate the password
    const passwordValidation = await bcrypt.compare(req.body.password, user.password)
    if (!passwordValidation) return res.status(401).json({ message: "Incorrect email and/or password" })

    //Create and assign a token when login successfully
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "2h" }) //set token expiry time to 2 hours
    res.header('auth-token', token)
        .send({
            message: "Success",
            token: token
        });

})


module.exports = router