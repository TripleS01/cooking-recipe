const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: [true, 'Username is required!'],
    },
    email: {
        type: String,
        minLength: 10,
        required: [true, 'Email is required!'],
        unique: true,
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, 'Password is required!'],
    },
    createdRecipes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Recipe',
    }],
    recommendRecipes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Recipe',
    }],
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 13);

});

const User = mongoose.model('User', userSchema);

module.exports = User;