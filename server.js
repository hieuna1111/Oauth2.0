require('dotenv').config();
const express = require('express');
const port = 4000;
const utils = require('./utils');

const app = express();

app.get('/auth', async (req, res) => {
  try {
    res.redirect(utils.request_get_auth_code_url);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

app.get(process.env.REDIRECT_URI, async (req, res) => {
  const authorization_token = req.query.code;
  console.log({ auth_server_response: authorization_token });

  try {
    const response = await utils.get_access_token(authorization_token);
    console.log({ data: response.data });
    // get access token from payload
    const { access_token } = response.data;
    const user = await utils.get_profile_data(access_token);
    const user_data = user.data;
    res.send(`
      <h1> welcome ${user_data.name}</h1>
      <img src="${user_data.picture}" alt="user_image" />
    `);
    console.log(user_data);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log('start 4000'));
