const { TwitterApi } = require('twitter-api-v2');

console.log(process.env.API_SECRET_KEY);
const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET_KEY,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.SECRET_TOKEN,
});

const newClient = client.readWrite;
module.exports = { newClient };
