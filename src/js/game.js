const CELL_SIZE = 15;
const LINE_COLOR = "#FFF";
let cellsAlive = [];

window.onload = () => {
  const canvas = document.createElement("canvas");

  canvas.id = "game";
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  renderGrid(ctx);

  canvas.onclick = ({ clientX, clientY }) => {
    const x = Math.trunc(clientX / CELL_SIZE) * CELL_SIZE;
    const y = Math.trunc(clientY / CELL_SIZE) * CELL_SIZE;

    cellsAlive.push([x, y]);

    ctx.fillStyle = LINE_COLOR;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  };

  document.body.onkeyup = (e) => {
    if (e.keyCode == 32) {
      canvas.onclick = undefined;
      startGame();
    }
  };
};

function startGame() {
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  const newCells = [];
  const ctx = document.getElementById("game").getContext("2d");
  let cellsToCheck = [].concat(cellsAlive);

  cellsAlive.forEach((cell) =>
    getNeighbors(cell[0], cell[1]).forEach((nei) => cellsToCheck.push(nei))
  );

  cellsAlive = [...new Set(cellsAlive.map(JSON.stringify))];
  cellsToCheck = [...new Set(cellsToCheck.map(JSON.stringify))];
  cellsToCheck.forEach((strCell) => {
    const cell = JSON.parse(strCell);
    let aliveCount = 0;
    getNeighbors(cell[0], cell[1]).forEach((i) =>
      cellsAlive.includes(JSON.stringify(i)) ? aliveCount++ : null
    );

    if (cellsAlive.includes(strCell)) {
      aliveCount >= 2 && aliveCount <= 3 ? newCells.push(cell) : null;
    } else {
      aliveCount == 3 ? newCells.push(cell) : null;
    }
  });

  cellsAlive = newCells;

  renderGrid(ctx);
  renderRects(ctx);
  requestAnimationFrame(gameLoop);
}

function renderGrid(ctx) {
  const cols = [0];
  const rows = [0];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 0.4;

  for (i = CELL_SIZE; i < ctx.canvas.width; i += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
    cols.push(i);
  }

  for (i = CELL_SIZE; i < ctx.canvas.height; i += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
    rows.push(i);
  }
}

function getNeighbors(x, y) {
  return [
    [x - CELL_SIZE, y - CELL_SIZE],
    [x - CELL_SIZE, y],
    [x - CELL_SIZE, y + CELL_SIZE],
    [x, y + CELL_SIZE],
    [x + CELL_SIZE, y + CELL_SIZE],
    [x + CELL_SIZE, y],
    [x + CELL_SIZE, y - CELL_SIZE],
    [x, y - CELL_SIZE],
  ];
}

function renderRects(ctx) {
  cellsAlive.forEach((cell) => {
    ctx.fillStyle = LINE_COLOR;
    ctx.fillRect(cell[0], cell[1], CELL_SIZE, CELL_SIZE);
  });
}
