const jwt = require('../lib/jsonwebtoken');
const { secretKey } = require('../config/config')

exports.authMiddleware = async (request, response, next) => {
    const token = request.cookies['auth'];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = await jwt.verify(token, secretKey);

        request.user = decodedToken;
        response.locals.isAuthenticated = true;

        next();

    } catch (error) {
        response.clearCookie('auth');
        response.redirect('/auth/login');
    }
}

exports.isAuth = (request, response, next) => {
    if (!request.user) {
        return response.redirect('/auth/login');
    }

    next();
}

exports.isLoggedOrRegistered = (request, response, next) => {
    if (request.user) {
        return response.redirect('/');
    }

    next();
}