const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler') 
const User = require('../models/userModel')

//@des create a new user
//@route POST api/users
//@acess Public
const registerUser = asyncHandler(async (req, res) => {
   const { name, email, password } = req.body

   if(!email || !password || !name){
      res.status(400)
      throw new Error('Please Fill in all feilds')
   }

   // Check if user alredy exist
   const userExists = await User.findOne({email})

   if(userExists){
      res.status(400)
      throw new Error('Username name already exsits')
   }


   // Hash Password
   const salt = await bcrypt.genSalt(10)
   const hasedPassword = await bcrypt.hash(password, salt)

   // create new user
   const user = await User.create({
      name,
      email,
      password: hasedPassword
   })

   if(user){
      res.status(201).json({
         _id: user.id,
         name: user.name,
         email: user.email,
         token: generateToken(user._id)
      })
   }else {
      res.status(400)
      throw new Error('Invaid registration details')
   }

})

//@des login a user
//@route POST api/user/login
//@acess Protected Routes
const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   // Check for the user email
   const user = await User.findOne({email})

   if(user && (await bcrypt.compare(password, user.password))){
      res.status(201).json({
         _id: user.id,
         name: user.name,
         email: user.email,
         token: generateToken(user._id)
      })
   }else {
      res.status(400)
      throw new Error('Invaid login details')
   }
} )

//@des get a user full info
//@route get /api/users/me
//@acess Private
const getMe = asyncHandler(async (req, res) => {
   const { _id, name, email }  = await User.findById(req.user.id)

   res.status(200).json({
      id: _id,
      name,
      email
   })

}) 


// Generate token
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
   } )
}


module.exports = {
   registerUser,
   loginUser,
   getMe
}