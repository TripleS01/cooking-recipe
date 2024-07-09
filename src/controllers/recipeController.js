const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const { isRecipeOwner } = require('../middlewares/recipeMiddleware');
const recipeService = require('../services/recipeService');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/', async (request, response) => {
    const recipes = await recipeService.getAll().lean();

    response.render('recipes/catalog', { recipes });

});

router.get('/:recipeId/details', async (request, response) => {
    const recipe = await recipeService.getOnePopulate(request.params.recipeId).lean();

    const isOwner = recipe.owner && recipe.owner._id == request.user?._id;
    const isRecommended = recipe.recommendList.some(user => user._id == request.user?._id);
    const isRecommendedCount = recipe.recommendList?.length || 0;

    response.render('recipes/details', { ...recipe, isOwner, isRecommended, isRecommendedCount });

});

router.get('/:recipeId/recommend', async (request, response) => {
    await recipeService.recommend(request.params.recipeId, request.user._id);

    response.redirect(`/recipes/${request.params.recipeId}/details`);

});


router.get('/create', isAuth, async (request, response) => {

    response.render('recipes/create');

});


router.post('/create', isAuth, async (request, response) => {
    const recipeData = request.body;

    try {
        await recipeService.create(request.user._id, recipeData);
        response.redirect('/recipes');

    } catch (error) {
        response.render('recipes/create', { ...recipeData, error: getErrorMessage(error) });
    }

});

router.get('/:recipeId/edit', isRecipeOwner, async (request, response) => {

    response.render('recipes/edit', { ...request.recipe });

});

router.post('/:recipeId/edit', isRecipeOwner, async (request, response) => {
    const recipeData = request.body;

    try {
        await recipeService.edit(request.params.recipeId, recipeData);

        response.redirect(`/recipes/${request.params.recipeId}/details`)

    } catch (error) {
        response.render('recipes/edit', { ...recipeData, error: getErrorMessage(error) });
    }

});

router.get('/:recipeId/delete', isRecipeOwner, async (request, response) => {
    await recipeService.delete(request.params.recipeId);

    response.redirect('/recipes');

});

module.exports = router;