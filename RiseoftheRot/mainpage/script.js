const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: canvas.width/2 - 20, y: canvas.height - 40, w: 40, h: 20, speed: 6 };
const bullets = [];
const zombies = [];
let score = 0;

// Spawn zombies every 1.5s
setInterval(() => {
  zombies.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    w: 40,
    h: 40,
    speed: 1 + Math.random() * 2
  });
}, 1500);

// Listen for clicks to shoot
canvas.addEventListener("click", (e) => {
  bullets.push({
    x: player.x + player.w/2 - 4,
    y: player.y,
    w: 8,
    h: 20,
    speed: 6
  });
});

// Move player with mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left - player.w/2;
});

// Main loop
function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Update & draw bullets
  ctx.fillStyle = "yellow";
  for (let i = bullets.length-1; i >= 0; i--) {
    let b = bullets[i];
    b.y -= b.speed;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    if (b.y + b.h < 0) bullets.splice(i, 1);
  }

  // Update & draw zombies
  ctx.fillStyle = "lime";
  for (let i = zombies.length-1; i >= 0; i--) {
    let z = zombies[i];
    z.y += z.speed;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    // Check collision with player (Game Over)
    if (z.y + z.h > player.y && z.x < player.x + player.w && z.x + z.w > player.x) {
      alert("Game Over! Final Score: " + score);
      document.location.reload();
    }

    // Check collisions with bullets
    for (let j = bullets.length-1; j >= 0; j--) {
      let b = bullets[j];
      if (b.x < z.x + z.w && b.x + b.w > z.x && b.y < z.y + z.h && b.y + b.h > z.y) {
        zombies.splice(i,1);
        bullets.splice(j,1);
        score++;
        break;
      }
    }

    // Remove if off screen
    if (z.y > canvas.height) zombies.splice(i,1);
  }

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  requestAnimationFrame(update);
}
update();
