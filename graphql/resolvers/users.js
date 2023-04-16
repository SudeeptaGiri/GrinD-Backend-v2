require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');


const {validateRegisterInput, validateLoginInput} = require('../../util/validator');
const User = require('../../models/User');

async function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.SECRET_KEY, {expiresIn: '1h'});
}


module.exports = {
   
    Query: {

        async getUser(_, {username}) {
            const foundUser = await User.findOne({ username });

            if(!foundUser) {
                throw new UserInputError("User not found", {});
            }

            return foundUser;
        }
    },

    Mutation: {

        async login(_, {username, password}) {
            console.log("This mutation was called");
            const {errors, valid} = validateLoginInput(username, password);
           
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }
            
            const user = await User.findOne({ username });
            
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async register(_, {registerInput: {username, email, password, confirmPassword}}, context, info) {
            // TODO: Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }

            // TODO: Make sure user doesn't exist

            const user = await User.findOne({ username });
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            const userMail = await User.findOne({ email });
            if(userMail) {
                throw new UserInputError('Email is already registered', {
                    errors: {
                        email: 'Email is already registered'
                    }
                });
            }

            // TODO: Hash password and create an auth token.
        
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                iconUrl:"",
                description:"Hey! I am new to GrinD!"

            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}