import twilio from 'twilio';
import nodemailer from 'nodemailer';
import pool from '../config/db.js';
import { response } from 'express';

const otpStore=[];
export const signup=(req,res)=>{

    const {ownerName,gender,dob,mobile,email,address,storeName,userName,storeCategory,storeAddress,BusinessContact,aadharNumber,PAN,documentType}=req.body;
    const {aadharNumberFront,aadharNumberBack,PANDocument,DocumentProof}=req.files
    
   
    try{
     const queryPersonal=`INSERT INTO  Vendor (ownerName,gender,dob,mobile,email,address) VALUES (?,?,?,?,?,?)`
     const values=[ownerName,gender,dob,mobile,email,address];
     pool.query(queryPersonal,values,(err,result)=>{
        console.log(result);
        if(err){
            return res.status(500).json({
                status:"error",
                message:"Something went wrong while trying to signup",
                error:err.message
            })
        }
        const vendorId=result.insertId;
        const queryshopDetails="INSERT INTO  vendorStoreDetails (storeName,vendor_id,userName,storeCategory,storeAddress,BusinessContact,logo,banner) VALUES (?,?,?,?,?,?,?,?)";

        const values=[storeName,vendorId,userName,storeCategory,storeAddress,BusinessContact,"uploads/defaultShop/banner.jpg","uploads/defaultShop/logo.jpg"]
        pool.query(queryshopDetails,values,(err,result)=>{
          if(err){
            return res.status(500).json({
                status:"error",
                message:"Something went wrong while trying to signup",
                error:err.message
            })
          }

          const queryKYC='INSERT INTO VendorKYCDetails (vendor_id,aadharNumberFront,aadharNumberBack,PANDocument,DocumentProof,aadharNumber,PAN,documentType) VALUES (?,?,?,?,?,?,?,?)'
          
          const values=[vendorId,aadharNumberFront[0].filename,aadharNumberBack[0].filename,PANDocument[0].filename,DocumentProof[0].filename,aadharNumber,PAN,documentType];
          pool.query(queryKYC,values,(err,result)=>{
            if(err){
                return res.status(500).json({
                    status:"error",
                    message:"Something went wrong while trying to signup",
                    error:err.message
                })
            }
            return  res.status(200).json({
                status:"success",
                message:"User signup successful"
            })
          })

        })
      
     })
      
    }catch(err){
        res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to signup",
            error:err.message
        });
    }

}


function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);
}

export const otpSend = async (req, res) => {
    try {
        const { mobile_number } = req.body;
        const mobileNumber = "+91" + mobile_number;

        // Twilio credentials from environment variables
        const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID;

        const client = twilio(twilioAccountSID, twilioAuthToken);

        // Generate and store the OTP
        const otp = generateOtp();
        otpStore[mobileNumber] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes
        
        // Send OTP via Twilio
        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioNumber,
            to: mobileNumber,
        });

        return res.json({
            status: "success",
            message: "OTP sent successfully",
            otp: otp, // Note: In production, don't return the OTP in the response for security
        });
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong while trying to send OTP",
            error: err.message,
        });
    }
};

export const emailOTP=async (req,res)=>{
    try {
        const { email } = req.body;

        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Replace with your email service
            secure:true,
            port:465,
            auth: {
                user:'vanshdeep703@gmail.com', // Email account username (e.g., your Gmail address)
                pass: 'ylql ugtz pouo qihs', // App password or email password
            },
        });

        // Generate OTP
        const otp = generateOtp();

        // Store the OTP with email as the key
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes
        
        // Email content
        const mailOptions = {
            from: 'vanshdeep703@gmail.com', // Sender's email
            to: email,                    // Recipient's email
            subject: 'Your OTP Code',     // Email subject
            text: `Your OTP code is: ${otp}`, // Email body
        };

        // Send OTP via email
        await transporter.sendMail(mailOptions);

        return res.json({
            status: "success",
            message: "OTP sent to email successfully",
            otp: otp, // Don't return OTP in production for security
        });
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong while trying to send OTP to email",
            error: err.message,
        });
    }
}

export const verifyOtp = (req, res) => {
    const { mobile_number, otp } = req.body;
    const mobileNumber = "+91" + mobile_number;

    // Check if OTP exists and is valid
    const storedOtpDetails = otpStore[mobileNumber];
    if (
        storedOtpDetails &&
        storedOtpDetails.otp === parseInt(otp) &&
        storedOtpDetails.expiresAt > Date.now()
    ) {
        // OTP is valid
        delete otpStore[mobileNumber]; // Clear OTP after verification
        return res.json({
            status: "success",
            message: "OTP verified successfully",
        });
    } else {
        // OTP is invalid or expired
        return res.status(400).json({
            status: "failed",
            message: "Invalid or expired OTP",
        });
    }
};
