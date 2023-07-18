const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

            // Create a new user and save it to the database
            await User.create({ name, email, password: hashedPassword });

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },



    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // Perform validation on the input data (e.g., check for required fields)

            // Check if the 'email' field is missing or empty
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // Find the user with the provided email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, 'your_secret_key_here', {
                expiresIn: '1h', // Token expires in 1 hour
            });

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        } catch (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    },


    logout: (req, res) => {
        try {
            // For logout, if you are using JWT, there's not much server-side work required.
            // The JWT token is stored on the client-side, so you just need to clear it from the client.
            // On the client-side, clear the token (e.g., from localStorage or cookies) after calling this route.
            return res.status(200).json({ message: 'Logout successful' });
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

            // Your reset password logic here.
            // This function should handle the password reset process.
            // For example, you may generate a reset token, send an email to the user,
            // and then handle the password reset in a separate route/controller.

            // Generate a reset token (you can use any method to create a unique token)
            const resetToken = jwt.sign({ userId: user.id }, 'reset_secret_key_here', {
                expiresIn: '1h', // Token expires in 1 hour
            });

            // Send an email to the user with a link to the password reset page
            // The link should include the resetToken as a query parameter or in the URL path.

            // After the user clicks the link and verifies the resetToken,
            // handle the password reset in a separate route/controller.
            // Verify the token, ask the user for a new password, and then update it.

            return res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (err) {
            console.error('Error resetting password:', err);
            return res.status(500).json({ error: 'Server error' });
        }
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
