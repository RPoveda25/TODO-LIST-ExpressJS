const bycrytpjs = require("bcryptjs");
const db = require("../db/db");
const { Router } = require("express");

const router = Router();

// login routes --------------------------------------------

router.get("/login", (req, res) => {
  res.render("login");
});

// autentication
router.post("/auth", async (req, res) => {
  const data = req.body;
  let hashPass = await bycrytpjs.hash(data.password, 8);

  if (data.user && data.password) {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [data.user],
      async (err, result) => {
        if (
          result.length == 0 ||
          !(await bycrytpjs.compare(data.password, result[0].password))
        ) {
          res.status(404).render("login", {
            alert: true,
            alertTitle: "Warning",
            alertMessage: "Error authent",
            alertIcon: "error",
            route: "/login",
          });
        } else {
          req.session.logged = true;
          req.session.user = result[0].name;
          res.render("login", {
            alert: true,
            alertTitle: "Successfully",
            alertMessage: "Login successful",
            alertIcon: "success",
            route: "/",
          });
        }
      }
    );
  }
});

// register routes ------------------------------------------
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const data = req.body;

  if (data.password !== data.passwordR) {
    res.render("register", {
      alert: true,
      alertTitle: "Warning",
      alertMessage: "Password not matches",
      alertIcon: "error",
      route: "",
    });
  } else {
    let hashPass = await bycrytpjs.hash(data.password, 8);

    db.query(
      "INSERT INTO users SET ?",
      {
        username: data.user,
        name: data.fulluser,
        rol: data.rol,
        password: hashPass,
      },
      async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.render("register", {
            alert: true,
            alertTitle: "Registered",
            alertMessage: "Resgiter successfully!",
            alertIcon: "success",
            route: "/login",
          });
        }
      }
    );
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
