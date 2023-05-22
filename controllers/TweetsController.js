const { createPool } = require('mysql2/promise');
const { addToOldTweets } = require('../middleware/middleware');
const moment = require('moment');
const connection = createPool({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getTimeLine = async (req, res) => {
  const q = 'SELECT * FROM timeline';
  try {
    const [tweets] = await connection.execute(q);

    tweets.sort((a, b) => {
      const dateA = moment(a.date);
      const dateB = moment(b.date);

      if (dateA.isSame(dateB)) {
        // If dates are equal, compare times
        const timeA = moment.duration(a.time);
        const timeB = moment.duration(b.time);

        return timeA.asMinutes() - timeB.asMinutes();
      }

      return dateA.diff(dateB);
    });

    res.status(200).json(tweets);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

const addToTimeline = async (req, res) => {
  const { time, date, tweet } = req.body;
  console.log(req.body);
  const q = `INSERT INTO timeline(time, date, tweet) VALUES (?, ?, ?)`;
  try {
    const result = await connection.execute(q,[time, date, tweet]);
    res.status(201).json('tweet created!');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: 'Internal server error',
    });
  }
};

const deleteTweetFromTimeline = async (req, res) => {
  const tweetId = req.params.id;
  const q = 'DELETE FROM timeline WHERE id = ?';

  try {
    const result = await connection.execute(q, [tweetId]);

    res.status(202).json('tweet deleted successfully');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: 'Internal server error',
    });
  }
};
const editTweetFromTimeline = async (req, res) => {
  const tweetId = req.params.id;
  const { time, date, tweet } = req.body.tweet;

  const q = 'UPDATE timeline SET time = ?, date = ?, tweet = ? WHERE id = ?';

  try {
    const result = await connection.execute(q, [time, date, tweet, tweetId]);
    res.status(202).json('tweet updated successfully');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: 'Internal server error',
    });
  }
};

async function getOldTweets(req, res) {
  const q = 'SELECT * FROM old_tweets';
  try {
    const [tweets] = await connection.execute(q);
    res.status(200).json(tweets.reverse());
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

module.exports = {
  getTimeLine,
  addToTimeline,
  deleteTweetFromTimeline,
  getOldTweets,
  editTweetFromTimeline,
};
