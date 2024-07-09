const router = require('express').Router();

const { isLoggedOrRegistered, isAuth } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/register', isLoggedOrRegistered, (request, response) => {
    response.render('auth/register');
});

router.post('/register', isLoggedOrRegistered, async (request, response) => {
    const userData = request.body;

    try {
        const token = await authService.register(userData);

        response.cookie('auth', token);
        response.redirect('/');

    } catch (error) {
        response.render('auth/register', { ...userData, error: getErrorMessage(error) })
    }
});

router.get('/login', isLoggedOrRegistered, (request, response) => {
    response.render('auth/login');
});

router.post('/login', isLoggedOrRegistered, async (request, response) => {
    const userData = request.body;

    try {
        const token = await authService.login(userData);

        response.cookie('auth', token);
        response.redirect('/')

    } catch (error) {
        response.render('auth/login', { ...userData, error: getErrorMessage(error) })
    }
});

router.get('/logout', isAuth, (request, response) => {
    response.clearCookie('auth');
    response.redirect('/');
})

module.exports = router;