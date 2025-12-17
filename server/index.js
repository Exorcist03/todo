const express = require('express');
const userRouter = require('./routes/userRoute');
const todoRouter = require('./routes/todoRoute');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error while connecting to the database, ", err);
});

app.get('/check', (req, res) => {
   return res.send("server is running fine");
})

app.use('/api/users', userRouter);
app.use('/api/todo', todoRouter);

app.listen(8000, () => {
    console.log("server running");
})