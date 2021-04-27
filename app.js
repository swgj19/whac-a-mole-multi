const squares = document.querySelectorAll('.square');
const mole = document.querySelector('.mole');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;

var socket = io();

function randomSquare() {
	squares.forEach((square) => {
		square.classList.remove('mole');
		square.classList.remove('hit');
	});

	let randomSquare = squares[Math.floor(Math.random() * 9)];
	randomSquare.classList.add('mole');

	hitPosition = randomSquare.id;
}

squares.forEach((square) => {
	square.addEventListener('mousedown', () => {
		if (square.id == hitPosition) {
			result++;
			score.textContent = result;
			square.classList.remove('mole');
			square.classList.add('hit');
			hitPosition = null;
		}
	});
});

function moveMole() {
	timerId = setInterval(randomSquare, 500);
}

moveMole();

function countDown() {
	currentTime--;
	timeLeft.textContent = currentTime;

	if (currentTime == 0) {
		clearInterval(countDownTimerId);
		clearInterval(timerId);
		// score is event with parameter
		// parameter is  from msg on server.js
		socket.emit('score', result);
		alert('GAME OVER! Your final score is ' + result);
	}
}

let countDownTimerId = setInterval(countDown, 1000);

//chat

document.addEventListener('DOMContentLoaded', function (event) {
	socket.on('chat_message', function (msg) {
		console.log(msg);
		document.getElementById('chat_messages').innerHTML += msg + '<p />';
	});
});

document.getElementById('send_btn').addEventListener('click', function () {
	socket.emit('chat_message', document.getElementById('chat_input').value);
});
