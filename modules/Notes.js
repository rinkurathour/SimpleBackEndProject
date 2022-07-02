const mongoose = require('mongoose');
const {Schema} = mongoose;


const notesSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId },
    title:{type:String,require:true},
    description:{type:String,require:true},
    tag:{type:String,require:true},
})


const Notes = mongoose.model('Notes',notesSchema);
module.exports = Notes;