const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- Map setup (1 = wall, 0 = empty)
const map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,0,1,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1]
];

const TILE_SIZE = 64;

// --- Player setup
let player = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2
};

// --- Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// --- Game Loop
function gameLoop() {
  movePlayer();
  render3D();
  requestAnimationFrame(gameLoop);
}

function movePlayer() {
  if (keys["ArrowLeft"]) player.angle -= 0.05;
  if (keys["ArrowRight"]) player.angle += 0.05;

  let dx = Math.cos(player.angle) * player.speed;
  let dy = Math.sin(player.angle) * player.speed;

  if (keys["ArrowUp"]) {
    player.x += dx;
    player.y += dy;
  }
  if (keys["ArrowDown"]) {
    player.x -= dx;
    player.y -= dy;
  }
}

// --- Raycasting render
function render3D() {
  ctx.fillStyle = "#87ceeb"; // sky
  ctx.fillRect(0, 0, WIDTH, HEIGHT/2);
  ctx.fillStyle = "#444"; // ground
  ctx.fillRect(0, HEIGHT/2, WIDTH, HEIGHT/2);

  const FOV = Math.PI / 3;
  const numRays = WIDTH;
  const halfFOV = FOV / 2;

  for (let ray = 0; ray < numRays; ray++) {
    const rayAngle = player.angle - halfFOV + (ray / numRays) * FOV;
    const dist = castRay(rayAngle);
    const correctedDist = dist * Math.cos(rayAngle - player.angle); // remove fisheye

    const wallHeight = (TILE_SIZE * 277) / correctedDist;
    const color = 255 - Math.min(255, correctedDist * 0.5);
    ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;

    ctx.fillRect(ray, (HEIGHT/2) - wallHeight/2, 1, wallHeight);
  }
}

// --- Ray collision check
function castRay(angle) {
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);

  for (let i = 0; i < 500; i++) {
    let x = player.x + cos * i;
    let y = player.y + sin * i;

    let mapX = Math.floor(x / TILE_SIZE);
    let mapY = Math.floor(y / TILE_SIZE);

    if (map[mapY] && map[mapY][mapX] === 1) {
      return i;
    }
  }
  return 500;
}

gameLoop();
