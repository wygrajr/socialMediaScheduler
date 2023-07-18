

// Sample social media feed data for testing purposes
const socialMediaFeed = [
    { id: 1, user: 'user1', content: 'This is a post from user1' },
    { id: 2, user: 'user2', content: 'Hello from user2!' },
    // Add more posts here
  ];
  
  // Function to get the social media feed
  const getSocialMediaFeed = (req, res) => {
    try {
      res.status(200).json(socialMediaFeed);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Function to post new content to the social media feed
  const postSocialMedia = (req, res) => {
    try {
      
      const { content } = req.body;
  
      // Generate a unique ID for the new post
      const newPost = {
        id: socialMediaFeed.length + 1,
        user: 'userX', // Replace 'userX' with the actual user posting the content (e.g., from user authentication)
        content,
      };
  
      // Add the new post to the socialMediaFeed array
      socialMediaFeed.push(newPost);
  
      // Return the newly created post in the response
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    getSocialMediaFeed,
    postSocialMedia,
  };
  