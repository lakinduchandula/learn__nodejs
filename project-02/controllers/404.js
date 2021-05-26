exports.NotFoundPage = (req, res, next) => {
  // this will handle all the undefined routes
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: req.path,
      isAuthenticated: req.isLoggedIn,
    });
};
