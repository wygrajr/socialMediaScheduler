const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/authRoutes');
  } else {
    next();
  }
};

module.exports = withAuth;
