var pg = require('pg');
var express = require('express');

var app = express();
var dataUrl = process.env.DATABASE_URL || 5432;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/bricks.html');
});

app.get('/scores', function(request, response){
	var scores;
	pg.connect(dataUrl, function(err, client) {
  		client.query('SELECT * FROM  hiscores;', function(err, results){
  			console.log(results);
  			scores = results.rows;
  			response.status(200).send(scores);
  		});
	});

});
app.get('/', function(request, response){
	console.log('hi get');
});
app.post('/', function(request, response){
	console.log('hi post');
	console.log(request.method);
	console.log(request.body);
	//pg.connect(dataUrl, function(err, client){
	//	client.query('', function(err, results){
		
	//	});
	//})
	//response.sendfile(__dirname + '/bricks.html');
	//response.end();
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function(){
	console.log("listening on port " + port);
});