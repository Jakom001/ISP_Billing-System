const User = require("../models/UserModel")


module.exports.getUsers = async (req, res) =>{
    try{
        const result = await User.find()
        res.status(200).json({success:true, message: "users", data:result})
    }catch(error){
        res.status(500).json({message: "Error retrieving forms", error:error})
    }
   
}