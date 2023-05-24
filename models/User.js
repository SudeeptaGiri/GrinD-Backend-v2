const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    profileIcon: String,
    iconUrl: String,
    description: String,
    sport_selection: Boolean,
    selected_sport: String,
    selected_category: String,
    started: Boolean,
    aiScore: String,
    progress: String,
    taskList: [
        {
            taskName: String,
            isChecked: Boolean
        }
    ]


});

module.exports = model('User', userSchema);