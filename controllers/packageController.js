require('dotenv').config()
const Package = require("../models/packageModel");
const RouterOSAPI = require('node-routeros').RouterOSAPI;
const {packageSchema} = require("../middlewares/validator");

const connection = new RouterOSAPI({
    host: process.env.MIKROTIK_HOST,
    user: process.env.MIKROTIK_USER,
    password: process.env.MIKROTIK_PASSWORD,
    port: process.env.MIKROTIK_PORT,
});

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
        // Validate the input
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
        const result = await Package.findByIdAndUpdate(id, 
            {
                packageName,
                price,
                type,
                uploadSpeed,
                downloadSpeed,
            },
            { new: true });
        
            // Update corresponding PPPoE profile in Mikrotik
        // try {
        //     const connection = await connectRouterOS();
        //     await connection.write('/ppp/profile/set', [
        //         '=.id=' + oldPackage.packageName,
        //         '=name=' + packageName,
        //         '=rate-limit=' + uploadSpeed + 'M/' + downloadSpeed + 'M'
        //     ]);
        // } catch (mikrotikError) {
        //     console.error("Error updating Mikrotik profile:", mikrotikError);
        //     res.status(500).json({ success: false, message: "Failed to update Mikrotik profile", error: mikrotikError.message });
        // }finally {
        //     connection.close();
        // }
        
        res.status(200).json({ success: true, message: "Package updated", data: result });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating package",
            error: error.message,
        });
    }
};

const deletePackage = async (req, res) => {
    try {
        const result = await Package.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }
        
        // // Delete corresponding profile in Mikrotik
        try{
            
            const connection = await connectRouterOS();
            await connection.write('/ppp/profile/remove', [
                '=.id=' + result.packageName
            ]);
            connection.close();

        }catch(mikrotikError){
            console.log("Error deleting Mikrotik Profile: ", mikrotikError);
            res.status(500).json({ success: false, message: "Failed to delete Mikrotik Profile", error: mikrotikError.message });
        }finally {
            connection.close();
        }
        res.status(200).json({ success: true, message: "Package deleted", data: result });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting package",
            error: error.message,
        });
    }
}

module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
};