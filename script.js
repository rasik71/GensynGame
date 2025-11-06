const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

let ant = {
  x: 100,
  y: canvas.height - 100,
  width: 60,
  height: 40,
  vy: 0,
  gravity: 0.9,
  jump: -18,
  onGround: true
};

let rocks = [];
let score = 0;
let gameSpeed = 6;
let gameRunning = false;

function drawAnt() {
  ctx.fillStyle = "#00ff99";
  ctx.beginPath();
  ctx.ellipse(ant.x + 15, ant.y + 20, 12, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(ant.x + 35, ant.y + 20, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  ctx.strokeStyle = "#00ff99";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(ant.x + 20, ant.y + 10 + i * 10);
    ctx.lineTo(ant.x + 45, ant.y + 5 + i * 10);
    ctx.stroke();
  }
}

function createRock() {
  const size = Math.random() * 15 + 40;
  rocks.push({ x: canvas.width, y: canvas.height - size - 60, size });
}

function drawRocks() {
  ctx.fillStyle = "#444";
  for (let rock of rocks) {
    ctx.beginPath();
    ctx.moveTo(rock.x, rock.y + rock.size);
    ctx.lineTo(rock.x + rock.size / 2, rock.y);
    ctx.lineTo(rock.x + rock.size, rock.y + rock.size);
    ctx.closePath();
    ctx.fill();
  }
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = "#003322";
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  // physics
  ant.y += ant.vy;
  ant.vy += ant.gravity;
  if (ant.y >= canvas.height - 100) {
    ant.y = canvas.height - 100;
    ant.vy = 0;
    ant.onGround = true;
  }

  drawAnt();

  // rock management
  rocks.forEach((rock) => (rock.x -= gameSpeed));
  if (
    rocks.length === 0 ||
    rocks[rocks.length - 1].x < canvas.width - (Math.random() * 300 + 400)
  ) {
    createRock();
  }

  drawRocks();

  // collision
  for (let rock of rocks) {
    if (
      ant.x + ant.width > rock.x &&
      ant.x < rock.x + rock.size &&
      ant.y + ant.height > rock.y
    ) {
      gameRunning = false;
      showGameOver();
    }
  }

  rocks = rocks.filter((r) => r.x + r.size > 0);

  score++;
  ctx.fillStyle = "#00ff99";
  ctx.font = "20px Trebuchet MS";
  ctx.fillText("Swarm Energy: " + score, 20, 40);

  // gradual speed increase
  if (score % 1000 === 0) gameSpeed += 0.5;

  requestAnimationFrame(update);
}

function jump() {
  if (ant.onGround && gameRunning) {
    ant.vy = ant.jump;
    ant.onGround = false;
  }
}

function startGame() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.animation = "fadeOut 1s ease";
  setTimeout(() => {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    score = 0;
    gameSpeed = 1;
    rocks = [];
    ant.y = canvas.height - 100;
    update();
  }, 1000);
}

function showGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff99";
  ctx.font = "40px Trebuchet MS";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 40);

  ctx.font = "24px Trebuchet MS";
  ctx.fillText("Final Swarm Energy: " + score, canvas.width / 2 - 130, canvas.height / 2);

  ctx.font = "18px Trebuchet MS";
  ctx.fillText("Tap or Press Space to Restart", canvas.width / 2 - 140, canvas.height / 2 + 40);

  document.addEventListener("keydown", restartHandler);
  document.addEventListener("touchstart", restartHandler);
}

function restartHandler() {
  document.removeEventListener("keydown", restartHandler);
  document.removeEventListener("touchstart", restartHandler);
  startGame();
}

document.getElementById("startBtn").addEventListener("click", startGame);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});
window.addEventListener("touchstart", jump);

