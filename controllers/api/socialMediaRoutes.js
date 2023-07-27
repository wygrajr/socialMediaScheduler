const router = require('express').Router();
const { getSocialMediaFeed, postSocialMedia } = require('../../controllers/socialMediaController');
const path = require('path')

router.get('/feed', getSocialMediaFeed);
router.post('/post', postSocialMedia);
router.get('/', (req,res)=>{
  
});

module.exports = router;
