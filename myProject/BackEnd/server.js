const express = require("express");
const cors = require("cors");

const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Use MVC routes
app.use("/recipes", recipeRoutes);

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});

