const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const recipeController = require('./controllers/recipeController');

router.use(homeController);
router.use('/auth', authController);
router.use('/recipes', recipeController);

router.all('*', (request, response) => {
    response.render('404');
});

module.exports = router;
