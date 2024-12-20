const User = require("../models/UserModel")


module.exports.getUsers = async (req, res) =>{
    try{
        const result = await User.find()
        res.status(200).json({success:true, message: "users", data:result})
    }catch(error){
        res.status(500).json({
            success:true,
            message: "Error retrieving users",
            error: error.message})
    }
   
}

module.exports.addUser = async(req,res) =>{
    const {
        type,
        firstName,
        lastName,
        username,
        password,
        package,
        email,
        expiryDate,
        phoneNumber,
        address,
        comment,
    } = req.body;

    try {
        const user = new User(
            {
                type,
                firstName,
                lastName,
                username,
                password,
                package,
                email,
                expiryDate,
                phoneNumber,
                address,
                comment,
            }
        );
        const saveUser = await user.save();
        res.status(201).json({message: "User created successfully", data: saveUser});
    
    }catch (error){
        res.status(500).json({message: "Error occured while creating the user", error: error.message})

    }
}