const express = require("express");

const pokemonRouter = require("./routes/pokemons");
const pokemonTypesRouter = require("./routes/pokemon-types");

const app = express();

const port = process.env.port || 3000;

app.use("/assets", express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

app.use("/api/pokemon", pokemonRouter);
app.use("/api/pokemonTypes", pokemonTypesRouter);

// app.get("/", (req, res) => {
//     res.render("index", {types: poketypes})
// });

app.listen(port);