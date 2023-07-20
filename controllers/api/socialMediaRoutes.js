const router = require('express').Router();
const { getSocialMediaFeed, postSocialMedia } = require('../../controllers/socialMediaController');

router.get('/feed', getSocialMediaFeed);
router.post('/post', postSocialMedia);
router.get('/', (req,res)=>{
    res.render('')  //Actual page to post here.
});

module.exports = router;
