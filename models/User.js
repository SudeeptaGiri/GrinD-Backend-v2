const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    profileIcon: String,
    iconUrl: String,
    description: String
});

module.exports = model('User', userSchema);