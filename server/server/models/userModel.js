const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    otp:String,
    otpExpire:Date,
    verificationOtp:{
      type:Boolean,
      default:false,
    },
verificationOtpExpire:Date,
  },
  { timestamps: true }
);


userSchema.pre('save',async function (next) {
 if(!this.isModified("password")) return next()
  this.password=await bcrypt.hash(this.password,10)
});

// userSchema.methods.compare_password=async (enterdPassword) => {
//  return await bcrypt.compare(enterdPassword,this.password);
// }


const User = mongoose.model('User', userSchema);

module.exports = { User };
