const express = require('express');
const router = express.Router();
const authController = require('../authController');
const withAuth = require('../../utils/auth');

// Route: POST /api/auth/register
router.post('/register', authController.register);

// Route: POST /api/auth/login
router.post('/login', authController.login);

// Route: POST /api/auth/logout
router.post('/logout',withAuth, authController.logout);

// Route: POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);
// Route: POST /api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPasswordToken);

// Route: POST /api/auth/change-password
router.post('/change-password',withAuth, authController.changePassword);

// Route: GET /api/auth/me (for getting the currently logged-in user)
router.get('/me', withAuth, authController.getLoggedInUser);

// Route: PUT /api/auth/update-profile
router.put('/update-profile', withAuth, authController.updateProfile);

module.exports = router;


