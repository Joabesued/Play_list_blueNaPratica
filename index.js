require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./database/db");
const Music = require("./model/Music");

const app = express();
let music = null;

connectDB();

const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

app.get("/", async (req, res) => {
  const playlist = await Music.find();
  res.render("index", { playlist });
});

app.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  music = await Music.findById({ _id: id });
  const playlist = await Music.find();
  res.render("admin", { playlist, music });
});

app.get("/admin", async (req, res) => {
  const playlist = await Music.find();
  res.render("admin", { playlist, music: null });
});

app.post("/create", async (req, res) => {
  const music = req.body;
  await Music.create(music);
  res.redirect("/");
});

app.post("/update/:id", async (req, res) => {
  const newMusic = req.body;
  await Music.updateOne({ _id: req.params.id }, newMusic);
  res.redirect("/admin");
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Music.deleteOne({ _id: id });
  res.redirect("/admin");
});

app.get("/authBloq", (req, res) => {
  res.send({message: "Página de administração bloqueada no momento"});
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);