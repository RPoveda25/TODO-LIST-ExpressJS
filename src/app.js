// Invoke the modules
const dotenv = require("dotenv");
const bycrytpjs = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const path = require("path");
const morgan = require("morgan");

// App
const app = express();

// Settings ----------------------------------------------------------------
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

// environment
dotenv.config({ path: __dirname + "/env/.env" });

// connect DB
const db = require("./db/db");

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret12345",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes -----------------------------------------------------------------
const userRoutes = require("./routes/users");

// auth pages
app.get("/", (req, res) => {
  if (req.session.logged) {
    res.render("index", {
      user: req.session.user,
      logged: true,
    });
  } else {
    res.render("index", {
      user: "You have not logged in",
      logged: false,
    });
  }
});

app.use(userRoutes);

// use public
app.use("/public", express.static(path.join(__dirname, "public")));

// Server running
app.listen(app.get("port"), () => {
  console.log("Server started on port " + app.get("port"));
});
