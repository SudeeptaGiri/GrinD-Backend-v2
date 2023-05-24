const {model, Schema} = require('mongoose');

const postSchema = new Schema({
    body: String,
    //adding title
    title: String,
    eventAt: String,
    username: String,
    iconUrl: String,
    email: String,
    description: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);