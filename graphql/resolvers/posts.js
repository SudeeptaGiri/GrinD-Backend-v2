const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                // TO FIX: Sorting the post according to created at date.
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        //async createPost(_, { body }, context) {
        async createPost(_, { body, title, eventAt }, context) {
            const user = checkAuth(context);

            if(body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                title,
                body,
                eventAt,
                description: "null",
                iconUrl: "null",
                user: user.id, 
                username: user.username,
                email: user.email,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },

        async deletePost(_, {postId}, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if(user.username === post.username) {
                    await post.deleteOne();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async likePost(_, {postId}, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post) {
                if(post.likes.find(like => like.username === username)) {
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    // Post is not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            
            } else throw new UserInputError('Post not found');
        },
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(`NEW_POST`)
        }
    }
}