const express=require ('express')
const userRouter=require('./routes/userRouter')
const chatRouter=require ('./routes/chatRouter')
const dotenv= require('dotenv');
const connectDB = require('./config/db');
const cors=require('cors')
dotenv.config();
connectDB();
const app=express();


var corsOptions = {
    origin: 'http://localhost:5173', // No trailing slash
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true // Include this if you're dealing with credentials
};

app.use(cors(corsOptions)); // This should be before your routes

//  app.options('*', cors(corsOptions)); // Allow preflight requests

app.use(express.json())

const port=process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("hello your first server")
})
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})