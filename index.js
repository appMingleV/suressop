import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { otpSend, verifyOtp, emailOTP, signup,vendorDetails } from './controller/signupController.js'
import pool from './config/db.js'
import multer from "multer";

//multer upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/vendor/'); // Folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });
//uplaod images multiply
const multipleupload = upload.fields([{ name: 'aadharNumberFront' }, { name: 'aadharNumberBack' }, { name: 'PANDocument' }, { name: 'DocumentProof' }]);

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Welecome"
    })
})


app.post('/api/vendor/signup', multipleupload, signup)

//otp sending to given number-->
app.post('/api/otp/vendor/number', otpSend)

//otp for email sending to given email-->
app.post('/api/otp/vendor/email', emailOTP)


//verify the OTP-->
app.post('/api/number/verifyOTP', verifyOtpNumber);
app.post('/api/email/verifyOTP', verifyOtpEmail);


//get vendor details-->
app.get('/api/vendor/:vendorId',vendorDetails)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("geting Error ", err);
    }

    console.log(`Server is running on port ${process.env.PORT}`);
})