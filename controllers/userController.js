require('dotenv').config()
const User = require("../models/userModel");
const Package = require("../models/packageModel");
const RouterOSAPI = require('node-routeros').RouterOSAPI;
const { userSchema } = require("../middlewares/validator");

function getRouterConnection(){
    return  new RouterOSAPI({
        host: process.env.MIKROTIK_HOST,
        user: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASSWORD,
        port: process.env.MIKROTIK_PORT,
    });
}

const getUsers = async (req, res) =>{
    try{
        const result = await User.find().sort({createdAt: -1}).populate({
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
        packageId,
        email,
        phoneNumber,
        address,
        comment,
    } = req.body;

    try {
        const {error, value} = userSchema.validate({
            type,
            firstName,
            lastName,
            username,
            userPaass,
            packageId,
            email,
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
        console.log(selectedPackage)
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
            }
        );
        const saveUser = await user.save();

        // Create a new user on the Mikrotik RouterOS
        try{
            const conn = getRouterConnection();

            await conn.connect();

            await conn.write('/ppp/secret/add', [
                '=name=' + username,
                '=password=' + userPaass,
                '=service=pppoe',
                '=profile='+selectedPackage.packageName,
                '=disabled=yes',
                '=comment=' + `${firstName} ${lastName} - ${comment || ''}`,
            ]);
            conn.close();

        res.status(201).json({message: "User created successfully", data: saveUser});
    

        }catch (mikrotikError){
            await User.findByIdAndDelete(user._id)
            console.log("Error Creating mikrotik user: ", mikrotikError)
            return res.status(500).json({message: "Failed to create Mikrotik User", error: error.message})
        }  
    }catch (error){
        console.error('Error creating User:', error);
        return res.status(400).json({
            success: false,
            message: 'Error creating User',
            error: error.message,
        });  
    }
}

const deleteUser = async (req, res) =>{

    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success:false, message: "User not found"})
        }

        try{
            const conn = getRouterConnection();
            await conn.connect();
            
            // First find the item to get its ID
            const items = await conn.write('/ppp/secret/print', [
                '=.proplist=.id',
                '?name=' + user.username
            ]);

            if (items.length > 0) {
                // Delete using the internal ID
                await conn.write('/ppp/secret/remove', [
                    '=.id=' + items[0]['.id']
                ]);
            }
            conn.close();

            const result = await User.findByIdAndDelete(req.params.id);
            
            res.status(200).json({success:true, message: "User deleted successfully", data:result})

        } catch (mikrotikError) {
            console.error("Error deleting username in mikrotik: ", mikrotikError);
            res.status(500).json({ 
                success: false, 
                message: "Failed to delete Mikrotik profile", 
                error: mikrotikError.message 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error user",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    const {
        type,
        firstName,
        lastName,
        username,
        userPaass,
        packageId,
        email,
        phoneNumber,
        connectionExpiryDate,
        address,
        comment,
    } = req.body;

    try {
        // Validate input
        const {error, value} = userSchema.validate({
            type,
            firstName,
            lastName,
            username,
            userPaass,
            packageId,
            email,
            phoneNumber,
            connectionExpiryDate,
            address,
            comment,
        });

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                success: false,
                errors: error.details.map((err) => err.message),
            });
        }

        // Find the existing user first
        const existingUser = await User.findById(req.params.id).populate('package');
        if (!existingUser) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        // Validate the new package
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) {
            return res.status(400).json({message: "Invalid package selected"});
        }

        try {
            // Update Mikrotik profile first
            const connection = getRouterConnection()

            await connection.connect();

            // Find existing PPPoE secret
            const secrets = await connection.write('/ppp/secret/print', [
                '=.proplist=.id',
                '?name=' + existingUser.username
            ]);

            if (secrets.length > 0) {
                // Update the PPPoE secret
                await connection.write('/ppp/secret/set', [
                    '=.id=' + secrets[0]['.id'],
                    '=name=' + username,
                    '=password=' + userPaass,
                    '=profile=' + selectedPackage.packageName,
                    '=comment=' + `${firstName} ${lastName} - ${comment || ''}`,
                    // Add other relevant Mikrotik properties you want to update
                ]);

                connection.close();

                // If Mikrotik update succeeds, update MongoDB
                const result = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        type,
                        firstName,
                        lastName,
                        username,
                        userPaass,
                        package: packageId,
                        email,
                        phoneNumber,
                        connectionExpiryDate,
                        address,
                        comment,
                    },
                    {new: true}
                ).populate('package');

                res.status(200).json({
                    success: true,
                    message: "User and PPPoE secret updated successfully",
                    data: result
                });
            } else {
                connection.close();
                res.status(404).json({
                    success: false,
                    message: "PPPoE secret not found in Mikrotik"
                });
            }

        } catch (mikrotikError) {
            console.error("Error updating Mikrotik PPPoE secret:", mikrotikError);
            res.status(500).json({
                success: false,
                message: "Failed to update Mikrotik PPPoE secret",
                error: mikrotikError.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};
module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    getUserById
}