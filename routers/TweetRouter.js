const router = require('express').Router();
const {
  getTimeLine,
  addToTimeline,
  deleteTweetFromTimeline,
  getOldTweets,
  editTweetFromTimeline,
} = require('../controllers/TweetsController');

const { createAITweet } = require('../controllers/AITweetController');

router.get('/timeline', getTimeLine);

router.post('/add-to-timeline', addToTimeline);

router.delete('/delete-tweet/:id', deleteTweetFromTimeline);

router.put('/update-tweet/:id', editTweetFromTimeline);

router.get('/get-old-tweets', getOldTweets);

router.post('/generate-tweet', createAITweet);

module.exports = router;
