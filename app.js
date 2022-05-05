import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotirank from './spotirank.js';
import { IP_ADDRESS } from './config.js';


const app = express()
  .use(express.static('../public'))
  .use(cors())
  .use(cookieParser());
let userInSession = false;

app.get("/login", function (req, res) {
  if (userInSession) {
    res.redirect(`/#?error=${"This app is currently in use by another user"}`);
    return;
  }

  res.redirect(spotirank.GetLoginUrl());
});

app.get("/callback", async function (req, res) {
  if (userInSession) {
    res.redirect(`/#?error=${"This app is currently in use by another user"}`);
    return;
  }

  const code = req.query.code;

  if (!(await spotirank.IsValidLogin(code))) {
    res.redirect(`/#?error=${"Invalid login attempt"}`);
    return;
  }

  userInSession = true;
  await spotirank.Start();
});

app.get("/logout", function (req, res) {
  if (!userInSession) {
    res.redirect(`/#?error=${"A user must be signed in to logout"}`);
    return;
  }

  userInSession = false;
  spotirank.Stop();
  res.redirect("/");
});


app.listen(8888, IP_ADDRESS);

console.log("Server started on port 8888");
