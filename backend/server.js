const dotenv =  require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoute')
const errorHandler = require('./middleware/errorMiddleware')

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/users", userRoutes)



// Routes
app.get("/", (req, res) => {
    res.send("Home");
})


// Error Middleware
app.use(errorHandler)

// connect to DB & start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));