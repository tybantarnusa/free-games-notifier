const axios = require('axios');
const API = 'https://www.reddit.com/r/GameDeals/.json';
var subscriber = [
    'U8c525e435278d45fb1537c0d2b38f62f',
    'Cb42efcb9445faba01fc20f5b2f8feaa0'
    // 'C43205f63c928a2d64e48b50349635933'
];

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
            text += "There is not any free games right now.";
        } else if (games.length == 1) {
            text += "There is maybe a FREE GAME right now!";
        } else {
            text += "There is maybe " + games.length + " FREE GAMES right now!";
        }

        games.forEach(game => {
            text += "\n\n" + game.title + "\n" + game.url;
        });

        // console.log(text);
        const message = { type: 'text', text: 
            text
        };

        if (event == null && games.length > 0) {
            subscriber.forEach(sub => {
                client.pushMessage(sub, message)
                .catch((err) => {
                    console.error(err);
                });
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