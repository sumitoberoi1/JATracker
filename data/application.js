const mongoCollections = require("../config/mongoCollections");
const applications = mongoCollections.applications;
const uuid = require('uuid/v4');
const createApplication = () => {
    const recipeCollection = await applications();
        const newApplication = {
            title: title,
            ingredients: ingredients,
            steps: steps,
            _id: uuid()
        };
        const newInsertInformation = await recipeCollection.insertOne(newRecipe);
        const newId = newInsertInformation.insertedId;
        return await getRecipeByID(newId);
}
module.exports = {
    createApplication
}