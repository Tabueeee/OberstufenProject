var plantuml = require('node-plantuml');
var fs       = require('fs');

var genS = plantuml.generate("server.txt");
genS.out.pipe(fs.createWriteStream("./server.png"));

var genC = plantuml.generate("client.txt");
genC.out.pipe(fs.createWriteStream("./client.png"));
