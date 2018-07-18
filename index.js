const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-396333556417-396335166129-9O5COjKlya25A8G39crc5P3a',
  name: 'JokeBot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:'
  };

  bot.postMessageToChannel(
    'general',
    'Get Ready To Laugh With @Jokebot!',
    params
  );
});

// Error Handler
bot.on('error', err => console.log(err));

// Message Handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }

  handleMessage(data.text);
});

// Respons to Data
function handleMessage(message) {
  if (message.includes(' chucknorris')) {
    chuckJoke();
  } else if (message.includes(' yomama')) {
    yoMamaJoke();
  } else if (message.includes(' random')) {
    randomJoke();
  } else if (message.includes(' help')) {
    runHelp();
  } else if (message.includes(' weather')) {
    const zip = /\b\d{5}/.exec(message)[0];
    currentWeather(zip);
  } else if (message.includes(' icon')){
    getIcon();
  }

}

// Get Current Weather
function currentWeather(zip){
  axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=3a2b1eb49ad5b028d2982b13569c0883`)
    .then(res => {
      const temp = res.data.main.temp;
      const city = res.data.name;
      const icon = res.data.weather[0]["icon"];

      const url = "http://openweathermap.org/img/w/" + icon + ".png";
      const params = {
        icon_url: url
      };
      bot.postMessageToChannel('general', `The temperature in ${city} is ${temp} F`, params);
    }).catch(err => console.log(err));
}
// Tell a Chuck Norris Joke
function chuckJoke() {
  axios.get('http://api.icndb.com/jokes/random').then(res => {
    const joke = res.data.value.joke;

    const params = {
      icon_emoji: ':laughing:'
    };

    bot.postMessageToChannel('general', `Chuck Norris: ${joke}`, params);
  }).catch(err => console.log(err));
}

// Tell a Yo Mama Joke
function yoMamaJoke() {
  axios.get('http://api.yomomma.info').then(res => {
    const joke = res.data.joke;

    const params = {
      icon_emoji: ':laughing:'
    };

    bot.postMessageToChannel('general', `Yo Mama: ${joke}`, params);
  }).catch(err => console.log(err));
}

// Tell a Random Joke
function randomJoke() {
  const rand = Math.floor(Math.random() * 2) + 1;
  if (rand === 1) {
    chuckJoke();
  } else if (rand === 2) {
    yoMamaJoke();
  }
}

// Show Help Text
function runHelp() {
  const params = {
    icon_emoji: ':question:'
  };

  bot.postMessageToChannel(
    'general',
    `Type @jokebot with either 'chucknorris', 'yomama' or 'random' to get a joke`,
    params
  );
}