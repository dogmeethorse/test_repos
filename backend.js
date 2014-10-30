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
	pg.connect(dataUrl, function(err, client, done) {
  		client.query('SELECT * FROM  hiscores ORDER BY score DESC;', function(err, results){
  			if(err){
  				response.status(500).send();
  				console.log("db error");
  				done();
  			}
  			scores = results.rows;
  			response.status(200).send(scores);
  			done();
  		});
	});

});

app.post('/', function(request, response){
	var queryString = "INSERT INTO hiscores VALUES ('" + String(request.body.name) + "', " +
		String(request.body.score) + ");";
	console.log(queryString); 
	pg.connect(dataUrl, function(err, client, done){
		client.query(queryString, function(err, results){
			queryString = "DELETE FROM hiscores WHERE score <" +
						" (SELECT score FROM hiscores ORDER BY score DESC offset 20 limit 1);"
			client.query(queryString, function(err, results){
				console.log(results);
				done();
			});
		});
	});
	response.status(200).send();
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function(){
	console.log("listening on port " + port);
});