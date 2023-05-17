const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

const schedule = require('node-schedule');
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const TweetRouter = require('./routers/TweetRouter');
const LoginRouter = require('./routers/LoginRouter');
const { checkForTweet } = require('./controllers/AutoTweetController');

const { generateTweets } = require('./controllers/AITweetController');

const job1 = schedule.scheduleJob(' 0 * * * *', () => {
  checkForTweet();
});

app.use('/api', TweetRouter);
app.use('/api', LoginRouter);

app.listen(process.env.PORT || 3199, () => {
  console.log(`connected to port 3199`);
});
