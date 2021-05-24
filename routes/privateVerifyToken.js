const jwt = require("jsonwebtoken");


//middleware fucntion to check if user has the token
const auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status('401').send('Access Denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified //add user to the request object
        next() //pass on the request to the next middleware function otherwise the request will be left hanging

    } catch (error) {
        res.status(401).send({ error: "You are not logged in" })
    }
}

module.exports = auth