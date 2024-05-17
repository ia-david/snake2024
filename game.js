let player;
let gridSize = 20;
let cols, rows;
let food;
let gameOver = false;
let score = 0;
let bestScore = 0;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('game-canvas');
    frameRate(10);
    cols = floor(width / gridSize);
    rows = floor(height / gridSize);
    player = new Player();
    foodLocation();
    updateScore();
    updateBestScore();

    // Add event listeners for mobile controls
    document.getElementById('up-button').addEventListener('click', () => {
        if (player.ydir === 0) player.setDir(0, -1);
    });

    document.getElementById('down-button').addEventListener('click', () => {
        if (player.ydir === 0) player.setDir(0, 1);
    });

    document.getElementById('left-button').addEventListener('click', () => {
        if (player.xdir === 0) player.setDir(-1, 0);
    });

    document.getElementById('right-button').addEventListener('click', () => {
        if (player.xdir === 0) player.setDir(1, 0);
    });
}

function draw() {
    if (gameOver) {
        background('#1f1f1f');
        document.getElementById('game-canvas').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('replay-button').style.display = 'block';
        noLoop();
        return;
    }

    background('#1f1f1f');
    player.update();
    player.show();

    if (player.eat(food)) {
        foodLocation();
        score++;
        updateScore();
        if (score > bestScore) {
            bestScore = score;
            updateBestScore();
        }
    }

    fill('#ff4d4d');
    rect(food.x, food.y, gridSize, gridSize);

    if (player.checkCollision()) {
        gameOver = true;
    }
}

function foodLocation() {
    let x = floor(random(cols)) * gridSize;
    let y = floor(random(rows)) * gridSize;
    food = createVector(x, y);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW && player.xdir === 0) {
        player.setDir(-1, 0);
    } else if (keyCode === RIGHT_ARROW && player.xdir === 0) {
        player.setDir(1, 0);
    } else if (keyCode === DOWN_ARROW && player
