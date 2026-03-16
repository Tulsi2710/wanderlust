// Load environment variables in development
if(process.env.NODE_ENV !== "production") { 
    require('dotenv').config(); 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Configuration
const dbUrl = process.env.ATLASDB_URL;
const PORT = process.env.PORT || 8080;
const SESSION_SECRET = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === "production";

// MongoDB Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600
});
store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

// Session Configuration
const sessionOption = {
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax"
}
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session & Flash
app.use(session(sessionOption));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Import routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Validate required environment variables
if (!SESSION_SECRET) {
    console.error("ERROR: SESSION_SECRET is not defined in .env file");
    process.exit(1);
}

if (!dbUrl) {
    console.error("ERROR: ATLASDB_URL is not defined in .env file");
    process.exit(1);
}

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);



// Database Connection
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// Passport Configuration
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handler
app.use((err, req, res, next) => {
  if(res.headersSent){
    return next(err);
  }
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// Error Handler
// app.use((err, req, res, next) => {
//     let { status = 500, message = "Something went wrong!" } = err;
//     res.status(status).render("listings/error.ejs", { message });
// });

// Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});