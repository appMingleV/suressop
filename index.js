import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {otpSend,verifyOtp,emailOTP} from './controller/signupController.js'

dotenv.config();
const app =express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    return res.status(200).json({
        status:"success",
        message:"Welecome"
    })
})


// app.post('/api/signup')

//otp sending to given number-->
app.post('/api/otp/number',otpSend)
//otp for email sending to given email-->
app.post('/api/otp/email',emailOTP)


//verify the OTP
app.post('/api/verifyOTP',verifyOtp)
app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log("geting Error ",err);
    }

    console.log(`Server is running on port ${process.env.PORT}`);
})