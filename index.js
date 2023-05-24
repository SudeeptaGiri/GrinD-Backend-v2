// TODO: Fix subscription server

require('dotenv').config();
const {ApolloServer} = require('apollo-server');
const {PubSub} = require('graphql-subscriptions');
const mongoose = require('mongoose');


const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

// We need type definitions for GQL, hence we are declaring it below

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`Successfully connected to the database`)
        return server.listen(PORT);
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });
    
