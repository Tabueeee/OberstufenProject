var Datastore = require('nedb');
var db        = new Datastore({filename: __dirname + '/rooms.json', autoload: true});


var rooms = [
    "A002",
    "A103",
    "A108",
    "B001",
    "B003",
    "B005",
    "B009",
    "B011",
    "B013",
    "B017",
    "B019",
    "B021",
    "B022",
    "B101",
    "B103",
    "B105",
    "B109",
    "B111",
    "B113",
    "B117",
    "B119",
    "B121",
    "B122",
    "B124",
    "C001",
    "C002",
    "C004",
    "C005",
    "C007",
    "C013",
    "C015",
    "C017",
    "C021",
    "C023",
    "C025",
    "C101",
    "C102",
    "C103",
    "C105",
    "C106",
    "C108",
    "C110",
    "C114",
    "C116",
    "C118",
    "C122",
    "C124",
    "C126",
    "D001",
    "SPA1",
    "SPA2",
    "SPA3",
    "SPO1",
    "SPO2",
    "SPO3",
    "UA01",
    "UA02",
    "UA11",
    "UA12",
    "UB01",
    "UB03",
    "UB04",
    "W",
    "X",
    "Y",
    "Z"
];
rooms.forEach(function (room) {
    var wing  = room.substr(0, 1);
    var floor = room.substr(1, 1);

    var layout = 'groups';
    var room   = {
        wing: wing,
        floor: floor,
        layout: layout,
        roomid: room
    };

    db.insert(room);
});
