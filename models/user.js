const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    status: { type: String, enum: ['complete', 'pending'], default: 'pending' }
});

module.exports = mongoose.model('Task', TaskSchema);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    applications: [applicationSchema]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User