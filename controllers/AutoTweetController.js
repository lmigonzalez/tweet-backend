const { createPool } = require('mysql2/promise');
const { TwitterApi } = require('twitter-api-v2');
const moment = require('moment');

const { postTweetNow } = require('../middleware/middleware');

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

async function checkForTweet() {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm');

  const getTweet = `SELECT * FROM timeline WHERE date = ? AND time = ? LIMIT 1`;
  const deleteTweet = `DELETE FROM timeline WHERE id = ?`;
  const postInOldTweets = 'INSERT INTO old_tweets (tweet) VALUES (?)';

  try {
    // get tweet
    const [tweet] = await connection.execute(getTweet, [date, time]);
    console.log(tweet);

    if (
      tweet === undefined ||
      !tweet[0] ||
      !tweet[0].tweet ||
      !tweet[0].tweet.length
    ) {
      return;
    }

	console.log('tweet not found');

    // post tweet
    await postTweetNow(tweet[0].tweet);

    //post tweet on old tweets database
    await connection.execute(postInOldTweets, [tweet[0].tweet]);
    //delete tweet from timeline
    await connection.execute(deleteTweet, [tweet[0].id]);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { checkForTweet };
