'use strict';

require('dotenv').config()
const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();
const notifier = require('./notifier');
const subscriber = require('./subscriber');

app.get('/', function (req, res) {
  res.send("Free Games Notifier v2.0 server");
});

// register a webhook handler with middleware
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/notify', (req, res) => {
  notifier.notify(client, null);
  res.send('Notifier attempted!');
});

app.get('/subs', (req, res) => {
  console.log("test");
  subscriber.getAll()
  .then(result => {
    result = result.rows;
    res.json(result);
  })
  .catch(err => {
    res.json(err);
  });
});

app.get('/subscribe', (req, res) => {
  console.log("subscribe");
  subscriber.subscribe('C43205f63c928a2d64e48b50349635933')
  .then(result => {
    res.send('Success!');
  })
  .catch(err => {
    res.send(err);
  })
});

// event handler
function handleEvent(event) {
  if (event.type == 'join') {
    return subscriber.subscribe(event.source.groupId)
    .catch(err => {
      return Promise.resolve(null);
    });
  }

  else if (event.type == 'leave') {
    return subscriber.unsubscribe(event.source.groupId)
    .catch(err => {
      return Promise.resolve(null);
    });
  }

  if (event.message.text == '/check') {
    notifier.notify(client, event);
    return Promise.resolve(null);
  }

  else {
    return Promise.resolve(null);
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});