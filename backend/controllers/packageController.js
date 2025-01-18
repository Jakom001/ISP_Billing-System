require('dotenv').config()
const Package = require("../models/packageModel");
const RouterOSAPI = require('node-routeros').RouterOSAPI;
const {packageSchema} = require("../middlewares/validator");
const mongoose = require("mongoose");

function getRouterConnection(){
    return  new RouterOSAPI({
        host: process.env.MIKROTIK_HOST,
        user: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASSWORD,
        port: process.env.MIKROTIK_PORT,
    });
}

const getPackages = async (req, res) => {
    try {
        const result = await Package.find();
        res.status(200).json({ success: true, message: "packages", data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving packages",
            error: error.message,
        });
    }
};

const getPackageById = async (req, res) => {
    try {
        const result = await Package.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }
        res.status(200).json({ success: true, message: "package", data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving package",
            error: error.message,
        });
    }
};

const createPackage = async (req, res) => {
    const { packageName, price, type, uploadSpeed, downloadSpeed } = req.body;

    try {
        const { error, value } = packageSchema.validate({
            packageName,
            price,
            type,
            uploadSpeed,
            downloadSpeed,
        });
        if (error) {
            return res
                .status(400)
                .json({ success: false, message: error.details[0].message });
        }

        // Create the package in MongoDB
        const packageData = await Package.create({
            packageName,
            price,
            type,
            uploadSpeed,
            downloadSpeed,
        });

        // Attempt to create the corresponding Mikrotik profile
        try {
            const connection = getRouterConnection();

            await connection.connect();

            await connection.write('/ppp/profile/add', [
                '=name=' + packageName,
                '=rate-limit=' + uploadSpeed + '/' + downloadSpeed,
                '=local-address=' + process.env.MIKROTIK_LOCAL_ADDRESS,
                '=parent-queue=' + process.env.MIKROTIK_PARENT_QUEUE,
                '=remote-address=' + process.env.MIKROTIK_REMOTE_ADDRESS,
                '=use-encryption=yes',
                '=dns-server=' + process.env.MIKROTIK_DNS_SERVER,
            ]);

            // Close connection after successful profile creation
            connection.close();
            return res
                .status(201)
                .json({ success: true, message: 'Package created', data: packageData });
        } catch (mikrotikError) {
            // Roll back the package creation in MongoDB
            await Package.findByIdAndDelete(packageData._id);

            console.error('Error creating Mikrotik Profile: ', mikrotikError);
            return res.status(500).json({
                success: false,
                message: 'Failed to create Mikrotik Profile',
                error: mikrotikError.message,
            });
        }
    } catch (error) {
        console.error('Error creating package:', error);
        return res.status(400).json({
            success: false,
            message: 'Error creating package',
            error: error.message,
        });
    }
};


const updatePackage = async (req, res) => {
    const { packageName, price, type, uploadSpeed, downloadSpeed } = req.body;
    const { id } = req.params;
    try {
        const { error, value } = packageSchema.validate({ packageName, price, type, uploadSpeed, downloadSpeed });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const oldPackage = await Package.findById(id);
        if (!oldPackage) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        try{
            // update mikrotik profile first
            const connection = getRouterConnection();
            await connection.connect();

            const profiles = await connection.write('/ppp/profile/print', [
                '=.proplist=.id',
                '?name=' + oldPackage.packageName
            ]);

            if(profiles.length > 0){
                await connection.write('/ppp/profile/set', [
                    '=.id=' + profiles[0]['.id'],
                    '=name=' + packageName,
                    '=rate-limit=' + uploadSpeed + '/' + downloadSpeed,
                    '=local-address=' + process.env.MIKROTIK_LOCAL_ADDRESS,
                    '=parent-queue=' + process.env.MIKROTIK_PARENT_QUEUE,
                    '=remote-address=' + process.env.MIKROTIK_REMOTE_ADDRESS,
                    '=use-encryption=yes',
                    '=dns-server=' + process.env.MIKROTIK_DNS_SERVER,
                ]);
                connection.close();

                // update mongodb
               const result = await Package.findByIdAndUpdate(id, 
                    {
                        packageName,
                        price,
                        type,
                        uploadSpeed,
                        downloadSpeed,
                    },
                    { new: true });
                
                res.status(200).json({ success: true, message: "Package and Mikrotik profile updated successfully", data: result });
            }

        } catch (mikrotikError) {
            console.error("Error updating Mikrotik profile:", mikrotikError);
            res.status(500).json({ 
                success: false, 
                message: "Failed to update Mikrotik profile", 
                error: mikrotikError.message 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating package",
            error: error.message,
        });
    }
};

const deletePackage = async (req, res) => {
    try {
        // First find the package to get its name for Mikrotik deletion
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        try {
            // Try to delete from Mikrotik first
            const connection =  getRouterConnection();

            await connection.connect();
            
            // First find the profile ID
            const profiles = await connection.write('/ppp/profile/print', [
                '=.proplist=.id',
                '?name=' + package.packageName
            ]);

            if (profiles.length > 0) {
                // Delete the profile using its ID
                await connection.write('/ppp/profile/remove', [
                    '=.id=' + profiles[0]['.id']
                ]);
            }

            connection.close();
            
            // Only if Mikrotik deletion succeeds, delete from MongoDB
            const result = await Package.findByIdAndDelete(req.params.id);
            
            res.status(200).json({ 
                success: true, 
                message: "Package and Mikrotik profile deleted successfully", 
                data: result 
            });

        } catch (mikrotikError) {
            console.error("Error deleting Mikrotik Profile: ", mikrotikError);
            res.status(500).json({ 
                success: false, 
                message: "Failed to delete Mikrotik profile", 
                error: mikrotikError.message 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting package",
            error: error.message,
        });
    }
};
module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
};