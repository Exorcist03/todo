const Todo = require('../models/todoModel');

async function getTodos(req, res) {
    const email = req.headers.email;
    try {
        const got = await Todo.find({email});
        return res.send(got);
    } catch (error) {
        console.error("Got error while getting todos,", error);
    }

}

async function createTodo(req, res) {
    const title = req.body.title, description = req.body.description;
    if(!title || !description) {
        return res.status(400).json({
            msg: "needed full info for your todo"
        })
    }
    await Todo.create({title, description, email: req.headers.email});
    return res.json({
        msg: "Todo created"
    })
}

async function markDone(req, res) {
    const id = req.params.id, email = req.headers.email;
    try {
        const got = await Todo.findOneAndUpdate({_id: id, email}, {
            completed: true
        });
        // console.log(got);
    } catch (error) {
        console.error("Error got in marking done the todo, ", error);
    }
    return res.json({
        success: true,
        msg: "Congrats you did a task!!!"
    })
}

module.exports = {
    createTodo, markDone, getTodos
}