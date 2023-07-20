const withAuth = (req, res, next) => {

  // If the session indicates that the user is logged in, allow the request to continue
  if (req.session.logged_in) {
    return next();
  }
  
  // If the user is not logged in, redirect the request to the login route
  return res.redirect('/login');
};

module.exports = withAuth;
