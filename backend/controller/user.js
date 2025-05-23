import { User } from "../models/user.js";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middleware/error.js"


export const getAllUsers = async (req, res) => {
    console.log("hello")
}

export const register = async (req, res, next) => {

   try {
     const {name, email, password} = req.body
 
     let user = await User.findOne({email})
 
     if(user){
         return next(new ErrorHandler("User already exist", 404))
     }
 
 
     user = await User.create({name, email, password})
 
    sendCookie(user, res, "Registered Successfully", 201)
   } catch (error) {
        next(error)
   }

}

export const login = async (req, res, next) => {

    try {
        const {email, password} = req.body
    
        const user = await User.findOne({email}).select("+password")
    
        if(!user){
            return next(new ErrorHandler("Invalid email or password", 400))
        }
    
        const isMatch = (password === user.password)
    
        if(!isMatch){
            return next(new ErrorHandler("Invalid email or password", 400))
        }
    
        sendCookie(user,res,`Welcome Back, ${user.name}`,200)
    } catch (error) {
        next(error)
    }
}

export const logout = (req, res) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true
    })
    .json({
        success: true,
        message: "logout successfully",
    })
}

export const getMyprofile = (req,res) => {

    res.status(200).json({
        success: true,
        user:req.user
    })

}