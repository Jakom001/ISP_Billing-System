const User = require("../models/userModel");
const Package = require("../models/packageModel");
const { userSchema } = require("../middlewares/validator");

const getUsers = async (req, res) =>{
    try{
        const result = await User.find().populate({
            path: "package",
            select: "packageName"
        })
        res.status(200).json({success:true, message: "users", data:result})
    }catch(error){
        res.status(500).json({
            success:true,
            message: "Error retrieving users",
            error: error.message})
    }
}

const getUserById = async (req, res) =>{
    try{
        const result = await User.findById(req.params.id).populate("package")
        if(!result){
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, message: "User", data:result})
    }
    catch(error){
        res.status(500).json({success:false, message: "Error retrieving user", error: error.message})
    }
}

const addUser = async(req,res) =>{
    const {
        type,
        firstName,
        lastName,
        username,
        userPaass,
        confirmUserPaass,
        packageId,
        email,
        phoneNumber,
        address,
        comment,
        connectionExpiryDate,
    } = req.body;

    try {
        const {error, value} = userSchema.validate({
            type,
                firstName,
                lastName,
                username,
                userPaass,
                confirmUserPaass,
                packageId,
                email,
                connectionExpiryDate,
                phoneNumber,
                address,
                comment,
        })

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                success: false,
                errors: error.details.map((err) => err.message),
            });
        }
        
        // Validate the package
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) {
        return res.status(400).json({ message: "Invalid package selected" });
        }

        const user = new User(
            {
                type,
                firstName,
                lastName,
                username,
                userPaass,
                package: packageId,
                balance: 0,
                email,
                phoneNumber,
                address,
                comment,
                connectionExpiryDate,
            }
        );
        const saveUser = await user.save();
        res.status(201).json({message: "User created successfully", data: saveUser});
    
    }catch (error){
        res.status(500).json({message: "Error occured while creating the user", error: error.message})

    }
}

const deleteUser = async (req, res) =>{
    try{
        const result = await User.findByIdAndDelete(req.params.id)
        if(!result){
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, message: "User deleted successfully", data:result})
    }
    catch(error){
        res.status(500).json({success:false, message: "Error deleting user", error: error.message})
    }
}

const updateUser = async (req, res) =>{
    const {
        type,
        firstName,
        lastName,
        username,
        userPaass,
        confirmUserPaass,
        packageId,
        email,
        phoneNumber,
        connectionExpiryDate,
        address,
        comment,
    } = req.body;

    try{
        const {error, value} = userSchema.validate({
            type,
                firstName,
                lastName,
                username,
                userPaass,
                confirmUserPaass,
                packageId,
                email,
                phoneNumber,
                connectionExpiryDate,
                address,
                comment,
        })

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                success: false,
                errors: error.details.map((err) => err.message),
            });
        }

        // Validate the package
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) {
        return res.status(400).json({ message: "Invalid package selected" });
        }

        const result = await User.findByIdAndUpdate(req.params.id,
            {
                type,
                firstName,
                lastName,
                username,
                userPaass,
                package : packageId,
                connectionExpiryDate,
                email,
                phoneNumber,
                address,
                comment,
            },
            {new:true}
        )
        if(!result){
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, message: "User updated successfully", data:result})
    }
    catch(error){
        res.status(500).json({success:false, message: "Error updating user", error: error.message})
    }
}



module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    getUserById
}