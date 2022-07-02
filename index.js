const express = require('express');
const connectMongo= require('./db');
const app = express();
const port = 3000;

connectMongo();
app.use(express.json())
app.use('/api/user',require('./routers/user'))
app.use('/api/notes',require('./routers/notes'))


app.listen(port,()=>{
    console.log(`app succefully is run on port is ${port}`)
})