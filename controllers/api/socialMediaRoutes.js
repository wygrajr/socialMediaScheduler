const router = require('express').Router();
const { getSocialMediaFeed, postSocialMedia } = require('../../controllers/socialMediaController');

router.get('/feed', getSocialMediaFeed);
router.post('/post', postSocialMedia);

module.exports = router;
