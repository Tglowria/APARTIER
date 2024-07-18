const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const passportSetup = require('./middleware/passportSetup')
const authRoutes = require('./routes/authRoutes');
const shortletRoutes = require('./routes/shortletRoutes');
const session = require("express-session");
const connection = require("./database/db")


const app = express();


app.use(express.json()); 
dotenv.config(); 
app.use(morgan("dev")); 


app.use(helmet());

app.use(
    session({
      secret: "jhktoyuroyro7667er76e8",
      resave: false,
      saveUninitialized: false,
    })
  );


app.use(passport.initialize());
app.use(passport.session());



const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Welcome To APARTIER APP");
});

app.use('/api/v1/shortlet', shortletRoutes);
app.use('/api/v1', authRoutes);

app.get("*", (req, res) => {

  res.status(404).json("page not found");
});

app.listen(port, async () => {
  try {
    console.log("Database connection established");
    console.log(`Server is listening on http://localhost:${port}`);
  } catch (error) {
    console.log("Error connecting to DB: " + error.message);
  }
});