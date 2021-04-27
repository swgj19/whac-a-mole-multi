var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
let highscore = 0;
app.listen(8080);

let highScore = 0;

//handle the http request
function handler(req, res) {
	var filePath = '.' + req.url;
	if (filePath == './') {
		filePath = './index.html';
	} else if (filePath == './wam/') {
		filePath = './index.html';
	}
	fs.readFile(
		filePath, //read index.html file and send 500 error if it fails.
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200); // send 200 response okay then send data (index.hmtl)
			res.end(data);
		}
	);
}

//io is the instance of socket.io declared on line 2
io.on('connection', function (socket) {
	console.log('User connected');

	io.emit('chat_message', 'User Connected');

<<<<<<< HEAD
	socket.broadcast.emit('chat_message', "User Connected");

	socket.broadcast.emit('chat_message', "User Connected");

=======
	socket.broadcast.emit('chat_message', 'User Connected');
>>>>>>> 0f56a3075ef5932f3cd63b8986c162b9c7fdce75

	socket.on('disconnect', function () {
		console.log('user disconnected');
		io.emit('chat_message', 'User Disconnected');
	});

	socket.on('chat_message', function (msg) {
		console.log(msg);
		io.emit('chat_message', msg);
	});
	socket.on('score', function(score){
		console.log(score);
		io.emit('score', score);
		if (msg > highscore){
			highscore = score;
			io.emit('chat_message', "A new high score was set: " + highscore)
		}
	});



	});
