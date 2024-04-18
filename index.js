const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function touchPosition(event)
{
	let x = event.touches[0].clientX;
	let y = event.touches[0].clientY;

	document.getElementById('test').innerHTML = x +", "+ y;
}

function vec2(x, y)
{
	return {x:x, y:y};
}

let keyPressed = [];

const upKey = 38;
const downKey = 40;

window.addEventListener('keydown', (event)=>{
	keyPressed[event.keyCode] = true;
});

window.addEventListener('keyup', (event)=>{
	keyPressed[event.keyCode] = false;
});


function paddle2AI(ball, paddle)
{
	if(ball.velocity.x > 0)
	{
		if(ball.pos.y > paddle.pos.y)
		{
			paddle.pos.y += paddle.velocity.y;

			if(paddle.pos.y + paddle.height >= canvas.height)
			{
				paddle.pos.y = canvas.height - paddle.height;
			}
		}

		if(ball.pos.y < paddle.pos.y)
		{
			paddle.pos.y -= paddle.velocity.y;

			if(paddle.pos.y <= 0)
			{
				paddle.pos.y = 0;
			}
		}
	}
}

function ballCollision()
{
	if(ball.pos.y + ball.radius >= canvas.height)
	{
		ball.velocity.y *= -1;
	}
	if(ball.pos.y - ball.radius <= 0)
	{
		ball.velocity.y *= -1;
	}
	// if(ball.pos.x + ball.radius >= canvas.width)
	// {
	// 	ball.velocity.x *= -1;
	// }
	// if(ball.pos.x - ball.radius <= 0)
	// {
	// 	ball.velocity.x *= -1;
	// }
}

function drawCenterLine()
{
	ctx.beginPath();
	ctx.strokeStyle = "#ffff00";
	ctx.lineWidth = 10;
	ctx.moveTo(canvas.width/2, 0);
	ctx.lineTo(canvas.width/2, canvas.height);
	ctx.stroke();
}

function paddleCollision(paddle)
{
	if(paddle.pos.y <= 0)
	{
		paddle.pos.y = 0;
	}
	if(paddle.pos.y + paddle.height >=canvas.height)
	{
		paddle.pos.y = canvas.height - paddle.height;
	}
}

function Paddle(pos, velocity, width, height)
{
	this.pos = pos;
	this.velocity = velocity;
	this.width = width;
	this.height = height;

	this.score = 0;

	this.update = function()
	{
		if(keyPressed[upKey])
		{
			this.pos.y -= this.velocity.y;
		}
		if(keyPressed[downKey])
		{
			this.pos.y += this.velocity.y;
		}
	}

	this.draw = function()
	{
		ctx.fillStyle = "#33ff00";
		ctx.beginPath();
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}

	this.getCenter = function()
	{
		return vec2(this.pos.x + this.width/2, this.pos.y + this.height/2);
	}
}

function Ball(pos, velocity, radius)
{
	this.pos = pos;
	this.velocity = velocity;
	this.radius = radius;

	this.update = function()
	{
		this.pos.x += this.velocity.x; 
		this.pos.y += this.velocity.y; 
	};

	this.draw = function()
	{
		ctx.fillStyle = "#33ff00";
		ctx.strokeStyle = "#33ff00";		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
	};
}


function ballPaddleCollision(ball, paddle)
{
	let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
	let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

	if(dx <= (paddle.width/2 + ball.radius) && (dy <= paddle.height/2 + ball.radius))
	{
		ball.velocity.x *= -1;
	}
}


function respawnBall(ball)
{
	if(ball.velocity.x > 0)
	{
		ball.pos.x = canvas.width - 150;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}

	if(ball.velocity.x < 0)
	{
		ball.pos.x = 150;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}

	ball.velocity.x *= -1;
	ball.velocity.y *= -1;
}

function increaseScore(ball, paddle1, paddle2)
{
	if(ball.pos.x <= -ball.radius)
	{
		paddle2.score++;
		document.getElementById('player2Score').innerHTML = paddle2.score;
		respawnBall(ball);
	}

	if(ball.pos.x >= canvas.width + ball.radius)
	{
		paddle1.score++;
		document.getElementById('player1Score').innerHTML = paddle1.score;
		respawnBall(ball);
	}
}

const ball = new Ball(vec2(200, 200), vec2(10, 10), 20);
const paddle1 = new Paddle(vec2(0, 50), vec2(15, 15), 20, 160);
const paddle2 = new Paddle(vec2(canvas.width-20, 50), vec2(15, 15), 20, 160);


function gameUpdate()
{
	ball.update();
	paddle1.update();
	// paddle2.update();

	paddle2AI(ball, paddle2);

	ballCollision(ball);
	paddleCollision(paddle1);
	ballPaddleCollision(ball, paddle1);
	ballPaddleCollision(ball, paddle2);

	increaseScore(ball, paddle1, paddle2);
}

function gameDraw()
{
	drawCenterLine();
	ball.draw();
	paddle1.draw();
	paddle2.draw();
}

function gameLoop()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	gameUpdate();
	gameDraw();

	window.requestAnimationFrame(gameLoop);
}

gameLoop();
