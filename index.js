let http = require("http");
let express = require("express");
let app = express();
let fs = require("fs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/app'));

let server = http.createServer(app);

server.listen(8080);

let entries = [];

let filename = __dirname + '/entries.json';

try{
	let filedata = fs.readFileSync(filename);
	entries = JSON.parse(filedata);
	console.log(entries.length + ' Datensätze eingelesen');
} catch(err) {
	console.log("Konnte keine Datensätze einlesen");
}

app.get('/entries', function(req, res){
	res.contentType("application/json");
	res.status(200).send(JSON.stringify(entries));
});

app.post('/entries', function(req, res){
	entries.push(req.body);
	fs.writeFileSync(filename, JSON.stringify(entries));
	res.contentType("text/html");
	res.status(201).send("OK");
});

app.delete('/entries/:id', function(req, res){
	entries.splice(req.params.id, 1);
	fs.writeFileSync(filename, JSON.stringify(entries));
	res.contentType("text/html");
	res.status(200).send("Element mit der ID " + req.params.id + " wurde gelöscht.");
});