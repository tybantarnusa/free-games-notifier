const { Client } = require('pg');

var subscriber = {}

subscriber.db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: true
});

// QUERIES //
const GET_ALL_QUERY = "SELECT * FROM subscribers";

const NEW_SUB = "INSERT INTO subscribers(lineid) VALUES($1)";

const REMOVE_SUB = "DELETE FROM subscribers WHERE lineid = $1";
/////////////

subscriber.subscribe = function(id) {
    subscriber.db.connect();
    return subscriber.db.query(NEW_SUB, [id]);
}

subscriber.unsubscribe = function(id) {
    subscriber.db.connect();
    return subscriber.db.query(REMOVE_SUB, [id]);
}

subscriber.getAll = function() {
    subscriber.db.connect();
    return subscriber.db.query(GET_ALL_QUERY);
}

module.exports = subscriber;