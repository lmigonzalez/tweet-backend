const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTweets(keywords) {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      max_tokens: 1000,
      prompt: `Give me 3 tweets related to ${keywords}, should be 3 strings separated by *, make sure they are friendly, aimed at my followers who are developers or aspire to be`,
    });
    return completion.data.choices[0].text;
  } catch (err) {
    console.log(err);
  }
}

async function createAITweet(req, res) {
  console.log(req.body);

  const keywords = req.body.subject;

  try {
    const response = await generateTweets(keywords);
    if (response == undefined) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
	console.log(response);
	
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

module.exports = { createAITweet };
