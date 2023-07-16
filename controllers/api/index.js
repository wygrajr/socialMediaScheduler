const router = require('express').Router();

const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const socialMediaRoutes = require('./socialMediaRoutes');

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/social-media', socialMediaRoutes);

module.exports = router;
