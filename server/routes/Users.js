const express = require("express")
const router = express.Router()
const { Users, Recipe, Recipe_Ingredient, Ingredient, FridgeIngredient, DietaryRestrictions, HealthLabel, Sequelize  } = require("../models")
const jwt = require('jsonwebtoken')
const authenticate = require('../middlewares/authenticate')
const bcrypt = require("bcrypt")
const saltRounds = 10


// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        const newUser = await Users.create({
            username: username, 
            email: email, 
            password: hashedPassword,
        })

        res.status(201).json({ user: newUser })
    } catch (error) {
        // Handle unique constraint violation (username or email already exists)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Username or email is already in use. Please choose a different one.' });
        }
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body 
    try{
        const foundUser = await Users.findOne({
            where: { username },
        })

        if (foundUser) {
            const passwordMatch = await bcrypt.compare(password, foundUser.password)
            if (passwordMatch){
                const token = jwt.sign({ userId: foundUser.id }, 'skey', { expiresIn: '5h' });
                res.json({ message: 'Login successful', token })
            } else {
                res.status(401).json({ error: 'Invalid credentials' })
            }
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Logout
router.post('/logout', authenticate, async (req, res) => {
    try {
        await req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/profile', authenticate, async (req, res) => {
    try {
        //Check if the user exists
        const user = await Users.findOne({
            where: { id: req.userId },
            attributes: ['username', 'email']
        })

        if(!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const responseData = {
            username: user.username,
            email: user.email,
        }

        res.json(responseData)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/profile_ingredient_list', authenticate, async (req, res) => {
    console.log('hit post ingredient_list route')
    console.log('Request payload:', req.body)
    try {
      const { name, quantity } = req.body;

    //   console.log('req.body' + name + quantity)

        // check if user's ingredient name is in the Ingredient table 
      const ingredient = await Ingredient.findOne({
        where: { 
            name: {
                [Sequelize.Op.like]: `%${name}%`, 
            },
        },
      })

      // if true 
      if (ingredient) {
        console.log('Ingredient:', ingredient.name)
      }
      else {
        console.error('Ingredient not found for: ', name)
        res.status(404).json({ error: 'Ingredient not found.' })
        return
      }

      // Check if the ingredient already exists in the user's profile
      const [userProfile, created] = await FridgeIngredient.findOrCreate({
        where: { 
            user_id: req.userId,
            ingredient_id: ingredient.id,
        },
        defaults: {
            quantity: quantity,
          },
      })

      // handle case if the user profile already has the ingrendient 
      if (!created) {
        //console.log('User already has this ingredient!')
        await userProfile.update({ quantity: quantity })
      }

        res.json({ message: 'Fridge updated successfully' })
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/saved_ingredients', authenticate, async (req, res) => {
    console.log('hit get_ingredient_list route');
    
    try {
        const userProfile = await FridgeIngredient.findAll({
            where: { user_id: req.userId },
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredient',
                    attributes: ['name'],
                },
            ],
        })

        if (userProfile && userProfile.length > 0) {
            const savedIngredients = userProfile.map(entry => ({
                name: entry.Ingredient.name,
                quantity: entry.quantity,
            }))
            res.json({ savedIngredients })
        } else {
            // no FridgeIngredient entry exists
            console.error('User profile not found.')
            res.status(404).json({ error: 'User profile not found.' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/delete_ingredient', authenticate, async (req,res) => {
    console.log('hit the delete route')
    try {
        const { name } = req.body

        console.log('Deleting ingredient with name:', name)

        const ingredient = await Ingredient.findOne({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${name}%`,
                },
            },
        })

        if (!ingredient) {
            console.error('Ingredient not found for:', name)
            return res.status(404).json({ error: 'Ingredient not found.' })
        }

        const deletedRows = await FridgeIngredient.destroy({
            where: {
                user_id: req.userId,
                ingredient_id: ingredient.id,
            },
        })

        if (deletedRows > 0){
            console.log('Ingredient deleted successfully from Fridge.')
            const updatedUserProfile = await FridgeIngredient.findAll({
                where: { user_id: req.userId },
                include: [
                    {
                        model: Ingredient,
                        as: 'Ingredient',
                        attributes: ['name'],
                    },
                ],
            })

            const updatedSavedIngredients = updatedUserProfile.map(
                (entry) => ({
                    name: entry.Ingredient.name,
                    quantity: entry.quantity,
                })
            )

            return res.json({ savedIngredients: updatedSavedIngredients })
        }
        else {
            console.error('Ingredient not found in user profile')
            return res.status(404).json({ error: 'Ingredient not found in user profile.' })
        }
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/dietary_restrictions', authenticate, async (req, res) => {
    try{
        console.log('hit diet route')
        const userId = req.userId
        console.log('userId: => ', userId)
        const { selectedRestrictions } = req.body
        console.log('selectedRestrictions: => ', selectedRestrictions)

        const healthLabelIds = Array.isArray(selectedRestrictions)
            ? selectedRestrictions
            : [selectedRestrictions]
        
        console.log(healthLabelIds)

        await DietaryRestrictions.destroy({
            where: { user_id: userId },
        })

        for (const healthLabelId of healthLabelIds) {
            await DietaryRestrictions.create({
                user_id: userId,
                healthLabel_id: healthLabelId,
            })
            console.log(`Dietary restriction created for healthLabelId ${healthLabelId}.`)
        }
       
        res.status(200).json({ message: 'Dietary restrictions saved successfully' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/user_healthlabels', authenticate, async (req, res) => {
    try {
        const userId = req.userId

        const dietaryRestrictions = await DietaryRestrictions.findAll({
            where: { user_id: userId },
            attributes: ['healthLabel_id'],
        })

        const healthLabelIds = dietaryRestrictions.map((restriction) => restriction.healthLabel_id)

        const healthLabels = await HealthLabel.findAll({
            where: { id: healthLabelIds },
            attributes: ['label'],
        })

        const labelValues = healthLabels.map((healthLabel) => healthLabel.label)

        res.status(200).json({ userHealthLabels: labelValues })

        // console.log(labelValues)
    }
    catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/healthlabels_ids', async (req, res) => {
    try{
        // console.log('het get health ids')
        const { selectedRestrictions } = req.query

        const healthLabels = await HealthLabel.findAll({
            where: { label: selectedRestrictions.split(',') },
            attributes: ['id'],
        })
        
        const healthLabelIds = healthLabels.map((label) => label.id)
    
        res.status(200).json({ healthLabelIds })
    }
    catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/healthlabels', async(req, res) => {
    console.log('hit get dietaryRestrictions route')
    try {

        // get all the labels send to frontend for checklist 
        const healthLabels = await HealthLabel.findAll({
            attributes: ['label'],
        })

        const labelValues = healthLabels.map((healthLabel) => healthLabel.label)

        res.status(200).json({ labels: labelValues })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
    
})

module.exports = router
