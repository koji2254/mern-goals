const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalsModel')
const User = require('../models/userModel')

//@des getGoals
//@route GET api/goals
//@acess Private
const getGoals = asyncHandler(async (req, res) => {
   const goals = await Goal.find({ user: req.user.id })

   res.status(200).json(goals)
})

//@des setGoal
//@route POST api/goals
//@acess Private
const setGoal = asyncHandler(async (req, res) => {
   if(!req.body.text){
      res.status(400)
      throw new Error('Please add a text field')
   }

   const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id
   })

   res.status(201).json(goal)
})

//@des getGoals
//@route PUT api/goals/id
//@acess Private
const updateGoal = asyncHandler(async (req, res) => {

   const goal = await Goal.findById(req.params.id)

   if(!goal){
      res.status(400)
      throw new Error('Goal not found')
   }

   const user = await User.findById(req.user.id) 

   // Ckeck for user
   if(!user) {
      res.status(401)
      throw new Error('User not found')
   }

   // Compare the goalid and userId
   if(goal.user.toString() !== user.id){
      res.status(401)
      throw new Error('User not authorised')
   }

   const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
       new: true,
      }
   )

   res.status(200).json(updatedGoal)
})

//@des deleteGoal
//@route delete api/goals/id
//@acess Private
const deleteGoal = asyncHandler(async (req, res) => {
  
   const goal = await Goal.findById(req.params.id)

   if(!goal){
      res.status(400)
      throw new Error('Goal not found')
   }
   const user = await User.findById(req.user.id) 

   // Ckeck for user
   if(!user) {
      res.status(401)
      throw new Error('User not found')
   }

   // Compare the goalid and userId
   if(goal.user.toString() !== user.id){
      res.status(401)
      throw new Error('User not authorised')
   }

   await Goal.findByIdAndDelete(req.params.id)

   res.status(200).json({id: req.params.id})
})


module.exports = {
   getGoals,
   setGoal,
   updateGoal,
   deleteGoal
}