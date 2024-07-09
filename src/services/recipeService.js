const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.getAll = () => Recipe.find();

exports.getOne = (recipeId) => Recipe.findById(recipeId);

exports.getLatest = () => Recipe.find().sort({ createdAt: -1 }).limit(3);

exports.getOnePopulate = (recipeId) => this.getOne(recipeId).populate('owner').populate('recommendList');

exports.recommend = async (recipeId, userId) => {
    await Recipe.findByIdAndUpdate(recipeId, { $push: { recommendList: userId } });

    await User.findByIdAndUpdate(userId, { $push: { recommendRecipes: recipeId } });
};

exports.create = async (userId, recipeData) => {
    const createdRecipe = await Recipe.create({
        owner: userId,
        ...recipeData,
    });

    await User.findByIdAndUpdate(userId, { $push: { createdRecipes: createdRecipe._id } });

    return createdRecipe;
};

exports.delete = (recipeId) => Recipe.findByIdAndDelete(recipeId);

exports.edit = (recipeId, recipeData) => Recipe.findByIdAndUpdate(recipeId, recipeData, { runValidators: true });

exports.search = async (query) => {

    if (!query) {
        return await Recipe.find().lean();
    }
    return await Recipe.find({ title: { $regex: query, $options: 'i' } }).lean();
};