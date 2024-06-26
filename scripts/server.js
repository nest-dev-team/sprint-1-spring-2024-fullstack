const express = require("express");
const app = express();
const PORT = 3000;

const { newToken, updateEmail, updatePhone, countTokens } = require("./token");

// set up ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// routes
app.get("/", (request, response) => {
  response.render("index", {
    name: "Easter Bunny",
    title: "CLI Companion App",
  });
});

app.get("/new", (request, response) => {
  response.render("newtoken", { newToken: "" });
});

app.post("/new", async (request, response) => {
  const token = await newToken(request.body.username);

  if (token === null) {
    response.render("newtoken", {
      newToken: `Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first.`,
    });
  } else {
    response.render("newtoken", {
      newToken: `Token ${token} for user ${request.body.username} has been created.`,
    });
  }
});

app.get("/count", async (request, response) => {
  const tokenCount = await countTokens();
  console.log(tokenCount);
  response.render("count", { count: tokenCount });
});

app.get("/update-email", (request, response) => {
  response.render("update-email", { reply: "" });
});

app.post("/update-email", async (request, response) => {
  const res = await updateEmail(request.body.username, request.body.email);
  response.render("update-email", { reply: res });
  response.end();
});

app.get("/update-phone", (request, response) => {
  response.render("update-phone", { reply: "" });
});

app.post("/update-phone", async (request, response) => {
  const res = await updatePhone(request.body.username, request.body.phone);
  response.render("update-phone", { reply: res });
  response.end();
});
