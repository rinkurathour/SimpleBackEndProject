const express = require('express')
const { body,validationResult } = require('express-validator')
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../modules/Notes')
const router = express.Router()

// Router 1: router 1 to fetch all notes with require user
router.post('/fetchnotes',fetchuser,async (req,res)=>{

    try {
        
   
    const notes = await Notes.find({user:req.user.id})
    res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error accured")
    }
})

// Router 2: router 2 to create new notes with require user
router.get('/notes',[
    body('title').isLength({min:3}),
    body('description').isLength({min:5}),
    body('title').isLength({min:3})
],fetchuser,async (req,res)=>{
    const {title,description,tag} = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       return  res.status(400).json({errors:errors.array()})
    }
    try {
        const notes = await Notes.create({
            title,description,tag,user:req.user.id
        })
    res.json(notes)
    
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error accured")
    }
})

// Router 3: router 3 to update notes with require user 
router.put('/updatenotes/:id',fetchuser,async (req,res)=>{
    const{title,description,tag} = req.body;

    const newNotes = {};
    if(title){newNotes.title = title}
    if(description){newNotes.description = description}
    if(tag){newNotes.tag = tag}

    // checkout the notes is availble is not
    let notes = await Notes.findById(req.params.id)
    if(!notes){
      return  res.status(404).send("Not Found")
    }

    // Checkout the same user or not when update notes
    if(notes.user.toString() !== req.user.id){
     return   res.status(401).send("Not Allowed")
    }

   notes = await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true})
   res.json(notes)

})


// Router 4: router 4 to delete notes from database with require user
router.delete('/deletenotes/:id',fetchuser,async (req,res)=>{
    const{title,description,tag} = req.body;

    

    // checkout the notes is availble is not
    let notes = await Notes.findById(req.params.id)
    if(!notes){
      return  res.status(404).send("Not Found")
    }

    // Checkout the same user or not when update notes
    if(notes.user.toString() !== req.user.id){
     return   res.status(401).send("Not Allowed")
    }

   notes = await Notes.findByIdAndDelete(req.params.id)
   res.json({"succes":"notes succesfully delete",notes:notes})

})
module.exports = router;