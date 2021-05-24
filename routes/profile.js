const router = require('express').Router();
const verifyToken = require('./privateVerifyToken');
const User = require('../models/User');

//add private route to check if the token exists when go to '/'
router.get('/', verifyToken, async (req, res) => {
    const id = req.user._id;//access to the user that is added to req object
    try {
        const user = await User.findById(id)
        res.json({ name: user.name, email: user.email })
    } catch (error) {
        res.status(401).json({ error: "Cannot find user" })
    }
});

module.exports = router;