const mongoose = require('mongoose');
const Url ='mongodb://localhost:27017/test'

const connectMongo = ()=>{
    mongoose.connect(Url,()=>{
        console.log('mongoDB is succesfully connect')
    })
}

module.exports = connectMongo