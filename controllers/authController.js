const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer')
const path = require('path');
const generateSecretKey = require('../utils/secretKeyGenerator');
const withAuth = require('../utils/auth');
const secretKey = generateSecretKey(32);

const authController = {
    register: async (req, res) => {
        try {
            // Extract data from the request body
            const { name, email, password } = req.body;

            // Perform validation on the input data
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required' });
            }

            // Validate email format using a regular expression
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if the user with the same email already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: 'User with this email already exists' });
            }

            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword)

            // Create a new user and save it to the database
            await User.create({ name, email, password: hashedPassword });

            req.session.logged_in = true;

            res.redirect('/', )
        } catch (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },



    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Perform validation on the input data (e.g., check for required fields)
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find the user with the provided email
            const user = await User.findOne({ where: { email }});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Set the session indicating the user is logged in
            req.session.logged_in = true;

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, secretKey, {
                expiresIn: '1h', // Token expires in 1 hour
            });

            res.redirect('/')
        } catch (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },


    logout: (req, res) => {
        try {
            // On the server-side, clear the session and set logged_in to false
            req.session.destroy(() => {
                req.session.logged_in = false;
                return res.status(200).json({ message: 'Logout successful' });
            });
        } catch (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email } = req.body;

            // Find the user with the provided email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const resetSecretKey = generateSecretKey(32);
            // Generate a reset token (you can use any method to create a unique token)
            const resetToken = jwt.sign({ userId: user.id }, resetSecretKey, {
                expiresIn: '1h', // Token expires in 1 hour
            });

            // Save the reset token in the user's record in the database
            await User.update({ resetToken }, { where: { id: user.id } });

            // Create a nodemailer transporter with your email service credentials
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Use your email service (e.g., 'Gmail', 'Outlook', 'Yahoo', etc.)
                auth: {
                    user: 'noreply.socialscheduler@gmail.com', // Replace with your email address
                    pass: 'SocialScheduler10!', // Replace with your email password
                },
            });

            // Create the email content
            const resetLink = `http://your_reset_password_url.com/reset/${resetToken}`;
            const mailOptions = {
                from: 'noreply.socialscheduler@gmail.com', // Replace with your email address
                to: email,
                subject: "Here's how to reset your password.", // Subject of the email
                text: `Click on the link below to reset your password:\n${resetLink}`, // Text content of the email
                html: `<p>Click on the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`, // HTML content of the email
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Error sending email' });
                }
                console.log('Email sent:', info.response);
                return res.status(200).json({ message: 'Password reset link sent to your email' });
            });
        } catch (err) {
            console.error('Error resetting password:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    resetPasswordToken: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            // Verify the reset token and find the user associated with it
            const user = await User.findOne({ where: { resetToken: token } });
            if (!user) {
                return res.status(404).json({ error: 'Invalid or expired reset token' });
            }

            // Update the user's password with the new one provided
            user.password = password;
            user.resetToken = null; // Clear the reset token after using it
            await user.save();

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error('Error resetting password:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    renderResetPasswordPage: (req, res) => {

        res.render('reset-password');
    },


    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            // Find the user with the provided email
            const user = await User.findOne({ where: { id: req.userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the provided current password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid current password' });
            }

            // Hash the new password before storing it in the database
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            await User.update({ password: hashedNewPassword }, { where: { id: req.userId } });

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (err) {
            console.error('Error changing password:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    getLoggedInUser: async (req, res) => {
        try {
            // Use this userId to find the logged-in user and return their profile information.
            const user = await User.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the user's profile information
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (err) {
            console.error('Error getting logged-in user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { name, email } = req.body;

            // Use this userId to find the logged-in user and update their profile information.

            // Find the user with the provided userId
            const user = await User.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the user's profile information
            await User.update({ name, email }, { where: { id: req.userId } });

            return res.status(200).json({ message: 'Profile updated successfully' });
        } catch (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },

};

module.exports = authController;
