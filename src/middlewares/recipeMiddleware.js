const recipeService = require('../services/recipeService');

async function isRecipeOwner(request, response, next) {
    const recipe = await recipeService.getOne(request.params.recipeId).lean();

    if (recipe.owner != request.user?._id) {
        return response.redirect(`/recipes/${request.params.recipeId}/details`);
    }

    request.recipe = recipe;

    next();
};

exports.isRecipeOwner = isRecipeOwner;