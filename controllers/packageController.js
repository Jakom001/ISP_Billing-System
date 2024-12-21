const Package = require("../models/packageModel");
const packageSchema = require("../middlewares/validator");

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
        const { error, value } = packageSchema.validate({ packageName, price, type, uploadSpeed, downloadSpeed });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const result = await Package.create({ packageName, price, type, uploadSpeed, downloadSpeed });
        res.status(201).json({ success: true, message: "Package created", data: result });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating package",
            error: error.message,
        });
    }
};

const updatePackage = async (req, res) => {
    const { packageName, price, type, uploadSpeed, downloadSpeed } = req.body;

    try {
        const { error, value } = packageSchema.validate({ packageName, price, type, uploadSpeed, downloadSpeed });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        
        const result = await Package.findByIdAndUpdate(req.params.id, 
            {
                packageName,
                price,
                type,
                uploadSpeed,
                downloadSpeed,
            },
            { new: true });
        if (!result) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }
        res.status(200).json({ success: true, message: "Package updated", data: result });
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
        const result = await Package.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }
        res.status(200).json({ success: true, message: "Package deleted" });
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