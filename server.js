var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
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

	socket.on('disconnect', function () {
		console.log('user disconnected');
		io.emit('chat_message', 'User Disconnected');
	});

	socket.on('chat_message', function (msg) {
		console.log(msg);
		io.emit('chat_message', msg);
	});
	// msg is being passed from client side.
	socket.on('score', function (msg) {
		console.log(msg);
		io.emit('score', msg);
		if (msg > highScore) {
			highScore = msg;
			io.emit('chat_message', 'Newest high score was just set' + highScore);
		}
	});
});
