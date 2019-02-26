const canvas = document.getElementById("canvasOne");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
let ballRadius = 10;
let ballColor = "#0095DD";
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 6;
let brickWidth = 72;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 20;
let brickOffsetLeft = 10;

let bricks = [];

let score = 0;

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].hit === false) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function initBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, hit: false };
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddleHeight - 5,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  }
  if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  }
  if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
}
function handleMouse(event){
    var relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let checkBrick = bricks[c][r];
      if (
        checkBrick.hit === false &&
        x + ballRadius > checkBrick.x &&
        x - ballRadius < checkBrick.x + brickWidth &&
        y + ballRadius > checkBrick.y &&
        y - ballRadius < checkBrick.y + brickHeight
      ) {
        if ( y + ballRadius > checkBrick.y) {
            dy = -dy;
        } else {
            dx = -dx;
        }
        bricks[c][r].hit = true;
        ballColor = "orange";
        score += 100;
      }
    }
  }
  if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      ballColor = "#0095DD";
    }
  }
}
function drawScore() {
  ctx.font = "16px arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 15);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionDetection();
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  if (y + dy > canvas.height - 8) {
    alert("Game Over");
    document.location.reload();
  }
  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  if (score === brickRowCount * brickColumnCount * 100) {
    alert("YOU WIN, CONGRATULATIONS! \n You Scored: "+score);
    document.location.reload();
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

initBricks();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", handleMouse, false);

draw()
