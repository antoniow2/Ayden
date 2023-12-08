const fs = require('fs')
const path = require('path')
const { Recipe, Recipe_Ingredient } = require('../models')
const { url } = require('inspector')

console.log('InsertData.js: Recipes:', Recipe)

// Read JSON data
const jsonData = fs.readFileSync(path.join(__dirname, 'data', 'chicken_recipes.json'), 'utf-8')
const recipesData = JSON.parse(jsonData);

// Insert data into Recipes table
recipesData.forEach(async (recipe) => {
  try {
    const createdRecipe = await Recipe.create({
      title: recipe.label,
      instructions: recipe.url, // You might want to adjust this based on your data structure
      calories: recipe.calories,
      total_time: recipe.totalTime * 60,
    });

    await Promise.all(recipe.ingredients.map(async (ingredients) => {
      await Recipe_Ingredient.create({
        name: ingredients.food,
        quantity: ingredients.quantity,
        weight: ingredients.weight,
        recipe_id: createdRecipe.id,
      })
    }))
    console.log(`Inserted recipe: ${recipe.label}`)

  } catch (error) {
    console.error('Error inserting recipe:', error)
  }
})

console.log('Data insertion completed.')