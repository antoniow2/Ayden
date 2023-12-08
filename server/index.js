const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path"); // Import the path module

const db = require("./models");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60, // 1 day
      httpOnly: true,
    },
  })
);

// Routers
const userRouter = require("./routes/Users.js");
app.use("/users", userRouter);
const recipeRouter = require("./routes/Recipe.js");
app.use("/recipe", recipeRouter);

const PORT = process.env.PORT || 3001;

// Serve static files from the "client" folder
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running'`);
  });
});
