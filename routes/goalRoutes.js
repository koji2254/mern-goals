const express = require('express')
const router = express.Router()
const { 
   getGoals,
   setGoal,
   deleteGoal,
   updateGoal
 } = require('../controllers/goalController')
 const protect = require('../middleware/authMiddleware')

 //@ create and get all Goals
 router.route('/').get(protect, getGoals).post(protect, setGoal)

 //@ update and delete the goals
 router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal)


module.exports = router