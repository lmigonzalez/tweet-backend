const { createPool } = require('mysql2/promise');
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET_KEY,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.SECRET_TOKEN,
});

const connection = createPool({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function addToOldTweets(tweet) {
  const q = `INSERT INTO old_tweets(tweet) VALUES ('${tweet}')`;
  try {
    await connection.execute(q);
    res.status(201).json('tweet created!');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: 'Internal server error',
    });
  }
}

async function postTweetFromTimeline(tweet) {
  try {
    const { data: createdTweet } = await client.v2.tweet(tweet);
  } catch (err) {
    console.log(err);
  }
}

async function postTweetNow(tweet) {
  console.log('tweet! ' + tweet);

  try {
    const { data: createdTweet } = await client.v2.tweet(tweet);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { addToOldTweets, postTweetFromTimeline, postTweetNow };
