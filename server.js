var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
app.listen(8080);

//handle the http request
function handler (req, res) {
		fs.readFile(__dirname + req.url,  //read the index.html file and send 500 error if it fails
		function (err, data) {
		  if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		  }
	  
		  res.writeHead(200);  // send 200 response okay then send data (index.hmtl)
		  res.end(data);
		});
	  }
	  