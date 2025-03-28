import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const protectRoute=async(req,res,next)=>{
    try {
        const token =req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"Unauthorized-No Token Provided"});
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error:"Unauthorized-invalid Token"});
        }

        const user=await User.findById(decoded.userId).select("-password");//-password to remove the password

        if(!user){
            return res.status(401).json({error:"User not found"});
        }
        req.user=user;//in req field we have the user that is from the db.we got an auth user

        next();

    } catch (error) {
        console.log('error in protectRoute controller',error.message);
        return res.status(500).json({error:"internal server error"});
    }
};

export default protectRoute;