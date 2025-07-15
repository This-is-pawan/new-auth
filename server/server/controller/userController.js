require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { User } = require("../models/userModel");
const nodemailer = require("nodemailer");

// Mail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.G_USER,
    pass: process.env.G_PASS, 
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email or password is missing",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const otp = generateOTP();
    const otpExpire = Date.now() + 1 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpire,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Send OTP for verification .",
     
  html: `
    
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
          <h2 style="text-align: center; color: #333;">Email Verification</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You recently requested to verify your email: <strong>${email}</strong>.</p>
          <p style="font-size: 16px;">Please use the following OTP to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 20px; color: #fff; background: #007bff; padding: 10px 20px; border-radius: 6px; display: inline-block; letter-spacing: 3px;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color: #888;">If you did not request this, please ignore this email.</p>
          <hr />
          <p style="text-align: center; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
  `
    };

    await transporter.sendMail(mailOption);
    res.status(201).json({
      success: true,
      message: "User registered & OTP sent successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email doesn't exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate OTP and save to user
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 2 * 60 * 1000);
    user.verificationOtp=false
    

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Send OTP for verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
          <h2 style="text-align: center; color: #333;">Email Verification</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You recently requested to verify your email: <strong>${email}</strong>.</p>
          <p style="font-size: 16px;">Please use the following OTP to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 20px; color: #fff; background: #007bff; padding: 10px 20px; border-radius: 6px; display: inline-block; letter-spacing: 3px;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color: #888;">If you did not request this, please ignore this email.</p>
          <hr />
          <p style="text-align: center; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with user info
    res.status(200).json({
      success: true,
      message: "Login successful. OTP sent to email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logout successfully" ,success:true});
  } catch (error) {
    res.json({ message: error, success: false });
  }
};

exports.verfiyOTP=async (req,res) => {
 
const {otp}=req.body

if (!otp) {
 res.json({message:`field is blank`})
}
const user=await User.findOne({otp})
user.verificationOtp = true;
    user.otp = undefined;
    await user.save();
if (!user) {
 res.json({message:`Otp is expired `})
}
 if (user.otpExpire < new Date()) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  user.otp = null;
  user.otpExpire = null;
  await user.save();
res.json({message:`user verify successfully`,success:true,})
}
exports.getData=async (req,res) => {
 const id=req.userId
try {
  const user=await User.findById(id);
 if(!user){
  res.json({message:`user doesn't exist `,success:false})
 }
res.json({message:`user exist success `,success:true,
 user:user.otpExpire
}) 
} catch (error) {
 res.json({message:error,success:false})
}

}