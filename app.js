const squares = document.querySelectorAll('.square');
const mole = document.querySelector('.mole');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');
const game = document.getElementById('game');
const chat = document.getElementById('chat');
const startbutton = document.getElementById('start_btn');
let countDownTimerId;
clearInterval(countDownTimerId);
game.style.display = "none";


let result = 0
let hitPosition
let currentTime = 60
let timerId = null
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



function countDown() {
 currentTime--
 timeLeft.textContent = currentTime

 if (currentTime == 0) {
   clearInterval(countDownTimerId)
   clearInterval(timerId)
   socket.emit('score', result);
   toggle_show_game();
   alert('GAME OVER! Your final score is ' + result)
   result = 0;
   hitPosition = null;
   currentTime = 60;
   timerId = null;
   timeLeft.textContent = currentTime
 }

}

function start_game(){
	toggle_show_game();
	moveMole();
	countDownTimerId = setInterval(countDown, 1000);
	
}

function toggle_show_game(){
	
	console.log(game.style.display);
	if (game.style.display === "none"){
		chat.style.display = "none";
		game.style.display = "block";
		
	} else {
		chat.style.display = "flex";
		game.style.display = "none";
		
	}

}

startbutton.addEventListener('click', function () {
	
	start_game();
});

//chat
const sendbutton = document.getElementById('send_btn');
const chat_input = document.getElementById('chat_input');
const chat_output = document.getElementById('chat_messages');
document.addEventListener("DOMContentLoaded", function(event) { 
  
  
  socket.on('chat_message', function(msg){
    console.log(msg);
    chat_output.innerHTML = msg + "<p />" + chat_output.innerHTML;
  });
 
  
});

chat_input.addEventListener('keypress', function(event){
	if (event.key == "Enter"){
		sendbutton.click();
	}
})

sendbutton.addEventListener('click', function () {
	socket.emit('chat_message', chat_input.value);
	chat_input.value = "";

});
