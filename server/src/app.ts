// import * as http from 'http';
// import {sendTestMail} from './testmail';

const Datastore = require('nedb');
const roomDb = new Datastore({filename: __dirname + '/data/rooms.json', autoload: true});

// sendMail(emailBody).then(console.log);


let express = require('express');
let app = express();

app.get('/rooms', async function (req, res) {
    try {
        let docs = await find(roomDb, {});
        console.log('docs: ' + JSON.stringify(docs));
        res.statusCode = 200;
        res.send(JSON.stringify(docs));
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send('internal server error.');
    }
});

app.get('/commonIssues', function (req, res) {

});

app.get('/mailGroups', function (req, res) {

});

// POST method route
app.post('/sendMail', function (req, res) {
    // let mailInfo = await sendMail();
    // console.log(mailInfo.messageId);
    // res.end(`mail successfully sent to ${mailInfo.envelope.to}`);
    console.log(req);
    res.send('POST request to the homepage');
});

async function find(db, query) {
    return new Promise(function (resolve, reject) {
        db.find(query, function (err, docs) {
            if (typeof err !== 'undefined' && err !== null) {
                reject(err);
            }
            resolve(docs);
        });
    });
}


app.listen(3000, () => console.log('Example app listening on port 3000!'));
