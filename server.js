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
	const clients = io.sockets.sockets;
	socket.broadcast.emit('chat_message', "User Connected"); // tell everyone else that a user has connected
	socket.data.user_name = socket.id; // set my temporary username
	socket.broadcast.emit('user_name_update', socket.id, socket.data.user_name);  //tell everyone else that I'm here. 
	for (const s of clients) {
		socket.emit('user_name_update', s[0], s[1].data.user_name, "connected");	// build my user list
	};
	
	socket.on('disconnect', function () {
		console.log('user disconnected: ' + socket.id);
		io.emit('user_name_update', socket.id, " ",  "disconnected");
		io.emit('chat_message', 'User Disconnected');
	});

	socket.on('chat_message', function (msg, user_name) {
		console.log(msg);
		io.emit('chat_message', user_name + " says: " + msg);
	});
	socket.on('score', function(score){
		console.log(score);
		io.emit('score', score);
		if (score > highscore){
			highscore = score;
			io.emit('chat_message', "A new high score was set: " + highscore)
		}
	});
	socket.on('user_name_update', function(username){
		socket.data.user_name = username;
		io.emit('user_name_update', socket.id, socket.data.user_name);
		
	});



	});
