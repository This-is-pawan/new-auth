require('dotenv').config();
const express=require('express');
const server=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const connection=require('./db/mongodb');
const { router } = require('./router/userRouter');
connection()
server.use(express.json())
server.use(cookieParser());
server.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
server.use('/api',router)
const port=process.env.PORT
server.listen(port,()=>{
console.log(`server is listen at port: ${port}`);
})


