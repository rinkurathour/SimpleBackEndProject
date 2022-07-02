const express = require('express')
const bcrypt = require('bcrypt')
const { body,validationResult} = require('express-validator')
const router = express.Router()
const User = require('../modules/User')
const jwt = require('jsonwebtoken')
const JWT_MYSECRET = 'This is my secret'
const fetchuser = require('../middleware/fetchuser')

router.post('/createuser',[
    body('name').isLength({min:5}),
    body('email').isEmail(),
    body('password').isLength({min:5})
] ,async (req,res)=>{
   // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    
    
    try {
    // Single user validation 
   let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({errors:errors.array()})
    }

    // Password hash 
     const salt = await bcrypt.genSalt();
     const haspass  = await bcrypt.hash(req.body.password,salt)
 // Create new user here 
     user =  await User.create({
        name:req.body.name,
        email:req.body.email,
        password:haspass
    })

    const data = { 
        user:{
            id:user.id
        }
    }
    // JWT use for send token
    const authToken  = jwt.sign(data,JWT_MYSECRET)

    res.send({user,authToken});
}catch (error) {
        console.error(error.message) 
        res.status(500).send("Some error accured")
    }
})

// User login by post ' /api/user/login'
router.post('/login',[
    body('email').isEmail(),
    body('password').isLength({min:5})
] ,async (req,res)=>{
   // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} = req.body;
    
    try {
    // Single user validation 
   let user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({errors:errors.array()})
    }

   // Password matching by bcrypt compare

   const passwordCompare = bcrypt.compare(password,user.password)
   if(!passwordCompare){
    return res.status(400).json({errors:"Please Enter a valid user"})

   }

    const data = { 
        user:{
            id:user.id
        }
    }
    // JWT use for send token
    const authToken  = jwt.sign(data,JWT_MYSECRET)
 console.log('user Succesfully login ')
    res.send({authToken});
}catch (error) {
        console.error(error.message) 
        res.status(500).send("Some error accured")
    }
})

   //Router 3: get user 
   router.post('/getuser',fetchuser,async (req,res)=>{
       
  try {
      const userId = req.user.id;
      const user = await User.findById( userId).select("-password")
      res.send(user)
  } catch (error) {
    console.error(error.message) 
    res.status(500).send("Some error accured")
}

}) 
module.exports = router;