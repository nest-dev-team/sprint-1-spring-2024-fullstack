const express = require("express");
const app = express();
const PORT = 3000;

const { newToken, updateEmail, updatePhone } = require("./token");

// set up ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// routes
app.get("/", (request, response) => {
  response.render("index", { name: "Easter Bunny", title: "CLI WEB SITE" });
});

app.get("/new", (request, response) => {
  response.render("newtoken");
});

app.post("/new", (request, response) => {
  const token = newToken(request.body.username);
  console.log(token);
  response.render("response", { newToken: token });
});

app.get("/update-email", (request, response) => {
  response.render("update-email", { reply: "" });
});

app.post("/update-email", async (request, response) => {
  const res = await updateEmail(request.body.username, request.body.email);
  response.render("update-email", { reply: res });
  response.end();
});
