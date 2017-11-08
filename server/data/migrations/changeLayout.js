var Datastore = require('nedb');
var db        = new Datastore({filename: __dirname + '/rooms.json', autoload: true});

var roomId = 'C017';
var layout = 'circle';
var update = false;


db.find({"roomid": roomId}, function (err, rooms) {
    if (err || rooms.length !== 1) {
        throw err;
    }
    var room = rooms[0];
    if (update === true) {
        db.update({"roomid": roomId}, {
            wing: room.wing,
            floor: room.floor,
            layout: layout,
            roomid: room.roomid,
            _id: room._id
        }, function (err, numAffected) {
            if (!err) {
                console.log('successfully updated ' + numAffected + ' items.');
            }
        });
    } else {
        console.log(room);
    }
});


db.update({"roomid": roomId}, {
    $set: {layout: layout}
}, function (err, numAffected) {
    if (!err) {
        console.log('successfully updated ' + numAffected + ' items.');
    }
});
