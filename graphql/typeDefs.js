const {gql} = require('apollo-server');

module.exports = gql `
    type Post {
        id: ID!
        title: String!
        eventAt: String!
        body: String!
        createdAt: String!
        username: String!
        iconUrl: String!
        email: String!
        description: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type Task {
        taskName: String!
        isChecked: Boolean!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        iconUrl: String!
        description: String!
        sport_selection: Boolean!
        selected_category: String!
        started: Boolean!
        aiScore: String!
        progress: String!
        taskList: [Task]!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getUser(username: String!): User!
    }
    
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(title: String!, body: String!, eventAt: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: String!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }

    type Subscription {
        newPost: Post!
    }

`;

