const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Get all packages
router.get('/all-packages', packageController.getPackages);

// Add a package
router.post('/add-package', packageController.addPackage);

// Update a package
router.put('/update-package/:id', packageController.updatePackage);

// Delete a package
router.delete('/delete-package/:id', packageController.deletePackage);

// Get a single package
router.get('/single-package/:id', packageController.singlePackage);

module.exports = router;
