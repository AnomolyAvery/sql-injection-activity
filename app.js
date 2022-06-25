const http = require('http');
const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.static('.'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run(`CREATE TABLE user (username TEXT, password TEXT, title TEXT)`);
    db.run(
        `INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')`
    );
});

app.get('/', (_, res) => {
    return res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const validationQuery =
        "SELECT title FROM user where username = '" +
        username +
        "' and password = '" +
        password +
        "'";

    console.log('username: ' + username);
    console.log('password: ' + password);
    console.log('query: ' + query);

    db.get(validationQuery, function (err, row) {
        if (err) {
            console.log('There was an error: ', err);
            return res.redirect('/index.html#error');
        }

        if (!row) {
            return res.redirect('/index.html#unauthorized');
        }

        return res.send(
            'Hello <b>' +
                row.title +
                '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>'
        );
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
