const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const posts = require('./posts');

module.exports = {
    Post: {
        likeCount: (parent) => {return parent.likes.length},
        commentCount: (parent) => {return parent.comments.length}
    },



    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },

    Subscription: {
        ...postsResolvers.Subscription
    }
}