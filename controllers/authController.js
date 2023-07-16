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
};

module.exports = authController;
