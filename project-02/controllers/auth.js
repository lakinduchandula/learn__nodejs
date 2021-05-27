exports.getLogin = (req, res, next) => {
  // info from cookie
  // const isLoggedIn = req.get("Cookie").split(";")[1].split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  console.log("Authenticated!");
  res.redirect("/");
};
