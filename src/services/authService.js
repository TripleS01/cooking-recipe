const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');

const User = require('../models/User');
const { secretKey } = require('../config/config')

exports.register = async (userData) => {
    if (userData.password !== userData.rePassword) {
        throw new Error('Password missmatch!');
    }

    const user = await User.findOne({ email: userData.email });

    if (user) {
        throw new Error('Email is already registered!');
    }

    const createdUser = await User.create(userData);

    const token = await generateToken(createdUser);

    return token;
};

exports.login = async (userData) => {
    const user = await User.findOne({ email: userData.email });

    if (!user) {
        throw new Error('Email or password is invalid!');
    }

    const isValid = await bcrypt.compare(userData.password, user.password);

    if (!isValid) {
        throw new Error('Email or password is invalid!');
    }

    const token = await generateToken(user);

    return token;
};

async function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    }

    const token = await jwt.sign(payload, secretKey, { expiresIn: '2h' });

    return token;
}