require('dotenv').config()

const axios = require('axios');
const webhook = process.env.DISCORD_WEBHOOK;

var discord = {};

discord.send = function(message) {
    axios.post(webhook, {
        content: message
    });
}

module.exports = discord;