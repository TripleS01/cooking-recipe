const router = require('express').Router();
const recipeService = require('../services/recipeService');

router.get('/', async (request, response) => {
    const latest3 = await recipeService.getLatest().lean();

    response.render('home', { latest3 });
});

router.get('/search', async (request, response) => {

    const searchQuery = request.query.search;
    const recipes = await recipeService.search(searchQuery);

    response.render('search', { recipes });

});

module.exports = router;