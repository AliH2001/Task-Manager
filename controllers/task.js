const User = require('../models/user')


const newTask = (req, res) => {
    res.render('Tasks/new.ejs', { title: 'Add a New Task' })
}

const createTask = async (req, res) => {
    try {  
        const currentUser = await User.findById(req.params.userId)
        console.log(req.body)
        currentUser.task.push(req.body) // pushing the formData into the user model
        await currentUser.save() // save our edits
        res.redirect(`/users/${currentUser._id}/tasks`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const index = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        res.render('Tasks/index.ejs', {
            title: 'Your Tasks',
            Tasks: currentUser.task,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const show = async (req, res) => {

    try {
        const currentUser = await User.findById(req.params.userId);

        // Check if user exists
        if (!currentUser) {
            return res.status(404).send("User not found");
        }

        // Find the task by taskId
        const Task = currentUser.task.id(req.params.TaskId);
        // Check if task exists
        if (!Task) {
            return res.status(404).send("Task not found");
        }

        // Render the task show page
        res.render('Tasks/show.ejs', {
            title: Task.title,
            task: Task,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};


const deleteTask = async (req, res) => {
    try {
        console.log('inside delete')
        const currentUser = await User.findById(req.params.userId)
        currentUser.task.id(req.params.TaskId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/tasks`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const edit = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const task = currentUser.task.id(req.params.TaskId)
        res.render('Tasks/edit.ejs', {
            title: task.title,
            task,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const update = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const task = currentUser.task.id(req.params.TaskId)

        task.set(req.body)
        await currentUser.save()

        res.redirect(`/users/${currentUser._id}/Tasks/${req.params.TaskId}`)

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

module.exports = {
    newTask,
    createTask,
    index,
    show,
    deleteTask,
    edit,
    update,
}