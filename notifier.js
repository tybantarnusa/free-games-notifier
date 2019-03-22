const axios = require('axios');
const API = 'https://www.reddit.com/r/GameDeals/.json';
const subscriber = require('./subscriber');

var subscribers = [];

var notifier = {};

notifier.notify = function(client, event) {
    axios.get(API)
    .then(result => {
        data = result.data.data.children.slice(0, 20);
        var games = []

        data.forEach(game => {
            var title = game.data.title;

            var t = title.toLowerCase();
            if (t.includes('100% off') || t.includes(' (100%') ||  t.includes('(free') ) {
                games.push(
                    {
                        title: title,
                        url: game.data.url
                    }
                );
            }
        });

        var text = "";
        if (games.length == 0) {
            text += "There are no free games right now.";
        } else if (games.length == 1) {
            text += "There is maybe a FREE GAME right now!";
        } else {
            text += "There are maybe " + games.length + " FREE GAMES right now!";
        }

        games.forEach(game => {
            text += "\n\n" + game.title + "\n" + game.url;
        });

        // console.log(text);
        const message = { type: 'text', text: 
            text
        };

        if (event == null && games.length > 0) {
            subscriber.getAll()
            .then(result => {
                subscribers = result.rows;
                subscribers.forEach(sub => {
                    client.pushMessage(sub.lineid, message)
                    .catch((err) => {
                        console.error(err);
                    });
                });
            })
            .catch(err => {
                console.log(err);
            });

            
        } else {
            if (event.source.groupId) {
                client.pushMessage(event.source.groupId, message)
                .catch((err) => {
                    console.error(err);
                });
            } else if (event.source.userId) {
                client.pushMessage(event.source.userId, message)
                .catch((err) => {
                    console.error(err);
                });
            }
        }
    })
    .catch(error => {
        console.log(error);
    });
}

module.exports = notifier;
