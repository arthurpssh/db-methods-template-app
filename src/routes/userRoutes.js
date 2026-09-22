const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Route to fetch users (with optional query parameters for filtering)
router.get('/', userController.getUsers);

// Route to create a new user
router.post('/', userController.createUser);

// Route to update an existing user by ID
router.patch('/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;