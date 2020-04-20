const CELL_SIZE = 15;
const LINE_COLOR = "#FFF";
let cellsAlive = [],
  pause = true,
  loops = 0;

window.onload = () => {
  setCanvasSize(document.body.clientWidth, document.body.clientHeight);
  renderGrid(document.getElementById("game").getContext("2d"));
  setListenersGamePaused();
};

function setCanvasSize(width, height) {
  const canvas = document.getElementById("game");

  canvas.width = width;
  canvas.height = height;
}

function setListenersGamePaused() {
  const btnPlay = document.getElementById("btn-play");
  const btnNext = document.getElementById("btn-next");
  const btnRefresh = document.getElementById("btn-refresh");

  document.body.onkeyup = (e) => {
    if (e.keyCode == 32) {
      startGame();
    }
  };

  document.getElementById("game").onclick = ({ clientX, clientY }) => {
    const ctx = document.getElementById("game").getContext("2d");
    const x = Math.trunc(clientX / CELL_SIZE) * CELL_SIZE;
    const y = Math.trunc(clientY / CELL_SIZE) * CELL_SIZE;
    const strCell = JSON.stringify([x, y]);

    if (!cellsAlive.includes(strCell)) {
      cellsAlive.push(strCell);
    } else {
      cellsAlive = cellsAlive.filter((cell) => cell !== strCell);
    }

    renderGrid(ctx);
    renderRects(ctx);
  };

  btnPlay.onclick = () => startGame();
  btnNext.onclick = () => {
    requestAnimationFrame(gameLoop);
  };
  btnRefresh.onclick = () => {
    pause = true;
    cellsAlive = [];
    loops = -1;
    requestAnimationFrame(gameLoop);
  };

  btnPlay.replaceChild(
    document.createTextNode("play_arrow"),
    btnPlay.childNodes[0]
  );
  btnNext.replaceChild(
    document.createTextNode("skip_next"),
    btnNext.childNodes[0]
  );
  btnRefresh.replaceChild(
    document.createTextNode("refresh"),
    btnRefresh.childNodes[0]
  );
}

function setListenersGameRunning() {
  const btnPlay = document.getElementById("btn-play");
  const btnNext = document.getElementById("btn-next");
  const btnRefresh = document.getElementById("btn-refresh");

  btnPlay.onclick = () => (pause = true);
  btnNext.onclick = undefined;
  btnRefresh.onclick = undefined;

  document.getElementById("game").onclick = undefined;
  document.body.onkeyup = (e) => {
    if (e.keyCode == 32) {
      pause = true;
    }
  };

  btnPlay.replaceChild(document.createTextNode("pause"), btnPlay.childNodes[0]);
  btnNext.replaceChild(document.createTextNode(""), btnNext.childNodes[0]);
  btnRefresh.replaceChild(
    document.createTextNode(""),
    btnRefresh.childNodes[0]
  );
}

function startGame() {
  setListenersGameRunning();
  pause = false;
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  const newCells = [];
  const ctx = document.getElementById("game").getContext("2d");
  const gameCounter = document.getElementById("game-counter");
  let cellsToCheck;

  cellsAlive = [...new Set(cellsAlive)];
  cellsToCheck = [].concat(cellsAlive);

  cellsAlive.forEach((strCell) => {
    const cell = JSON.parse(strCell);
    getNeighbors(cell[0], cell[1]).forEach((nei) =>
      cellsToCheck.push(JSON.stringify(nei))
    );
  });

  cellsToCheck = [...new Set(cellsToCheck)];

  cellsToCheck.forEach((strCell) => {
    const cell = JSON.parse(strCell);
    let aliveCount = 0;
    getNeighbors(cell[0], cell[1]).forEach((i) =>
      cellsAlive.includes(JSON.stringify(i)) ? aliveCount++ : null
    );

    if (cellsAlive.includes(strCell)) {
      aliveCount >= 2 && aliveCount <= 3
        ? newCells.push(JSON.stringify(cell))
        : null;
    } else {
      aliveCount == 3 ? newCells.push(JSON.stringify(cell)) : null;
    }
  });

  cellsAlive = newCells;

  gameCounter.replaceChild(
    document.createTextNode(++loops),
    gameCounter.childNodes[0]
  );

  renderGrid(ctx);
  renderRects(ctx);

  !pause ? requestAnimationFrame(gameLoop) : setListenersGamePaused();
}

function renderGrid(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 0.4;

  for (let i = CELL_SIZE; i < ctx.canvas.width; i += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
  }

  for (let i = CELL_SIZE; i < ctx.canvas.height; i += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
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
  cellsAlive.forEach((strCell) => {
    const cell = JSON.parse(strCell);
    ctx.fillStyle = LINE_COLOR;
    ctx.fillRect(cell[0], cell[1], CELL_SIZE, CELL_SIZE);
  });
}
