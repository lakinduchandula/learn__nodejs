exports.getLogin = (req, res, next) => {
  // info from cookie
  const isLoggedIn = req.get("Cookie").split(";")[1].split("=")[1];

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn = true");
  console.log("Authenticated!");
  res.redirect("/");
};
