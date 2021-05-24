const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/profile");

dotenv.config();
const port = process.env.PORT || 3000;


//connect to DB
const url = process.env.ATLAS_URL;
mongoose.connect(url,
    { useNewUrlParser: true },
    () => console.log('connected to db!')
);


// Middlewares
app.use(express.json()); //to read data from post request

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/profile", postRoute);


app.listen(port, () => console.log(`Server is running on ${port}`));