require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const TasksCtrl = require('./controllers/task')
const addFormatDateToViews = require('./middleware/addFormatDateToViews')

const port = process.env.PORT ? process.env.PORT : '3000'

// creates a connection to MONGO database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// MIDDLEWARE
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(addFormatDateToViews)
app.use(passUserToView)



// ROUTE HANDLERS
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)

app.use(isSignedIn) // anything under here, the user must be signed in


app.get('/users/:userId/Tasks/new', TasksCtrl.newTask) // view new Task form
app.post('/users/:userId/Tasks', TasksCtrl.createTask) // posting new Task to the database
app.get('/users/:userId/Tasks', TasksCtrl.index) // view all the Tasks
app.get('/users/:userId/Tasks/:TaskId', TasksCtrl.show) // show details of one Task
app.delete('/users/:userId/Tasks/:TaskId', TasksCtrl.deleteTask)
app.get('/users/:userId/Tasks/:TaskId/edit', TasksCtrl.edit) // view an edit form
app.put('/users/:userId/Tasks/:TaskId', TasksCtrl.update)

// app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})