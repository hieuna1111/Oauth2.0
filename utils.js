const query_string = require('querystring');
const axios = require('axios');

const google_auth_token_endpoint =
  'https://accounts.google.com/o/oauth2/v2/auth';

const google_access_token_endpoint =
  'https://accounts.google.com/o/oauth2/token';

const query_params = {
  client_id: process.env.CLIENT_APP_ID,
  redirect_uri: `http://localhost:4000${process.env.REDIRECT_URI}`,
};
// this objects contains information that will be passed as query params to the auth // token endpoint
const auth_token_params = {
  ...query_params,
  response_type: 'code',
};
// the scopes (portion of user's data) we want to access
const scopes = ['profile', 'email', 'openid'];
// a url formed with the auth token endpoint and the
const request_get_auth_code_url = `${google_auth_token_endpoint}?${query_string.stringify(
  auth_token_params
)}&scope=${scopes.join(' ')}`;

const get_access_token = async (auth_code) => {
  console.log(
    '🚀 ~ file: utils.js:27 ~ constget_access_token= ~ auth_code:',
    auth_code
  );
  const access_token_params = {
    ...query_params,
    client_secret: process.env.CLIENT_APP_SECRET,
    code: auth_code,
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post(
      google_access_token_endpoint,
      query_string.stringify(access_token_params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response;
  } catch (error) {
    console.log('get access token: ', error);
    throw error;
  }
};

const get_profile_data = async (access_token) => {
  return await axios({
    method: 'post',
    url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
  });
};

module.exports = {
  request_get_auth_code_url,
  get_access_token,
  get_profile_data,
};
