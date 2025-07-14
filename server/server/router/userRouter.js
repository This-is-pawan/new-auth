const express=require('express');
const { register, login, logout, verfiyOTP, getData } = require('../controller/userController');
const { verifyToken } = require('../middleware/authVerify');
const router=express.Router()
router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/verifyuser',verfiyOTP)
router.get('/getdata',verifyToken,getData)
module.exports={router}
