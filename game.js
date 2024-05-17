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
    } else if (keyCode === DOWN_ARROW && player.ydir === 0) {
        player.setDir(0, 1);
    } else if (keyCode === UP_ARROW && player.ydir === 0) {
        player.setDir(0, -1);
    }
}

class Player {
    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(cols / 2), floor(rows / 2));
        this.xdir = 0;
        this.ydir = 0;
        this.grow = false;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        if (!this.grow) {
            this.body.shift();
        }
        this.grow = false;
        head.x += this.xdir;
        head.y += this.ydir;
        this.body.push(head);

        // Check for collisions with walls
        if (head.x < 0) {
            head.x = cols - 1;
        } else if (head.x > cols - 1) {
            head.x = 0;
        } else if (head.y < 0) {
            head.y = rows - 1;
        } else if (head.y > rows - 1) {
            head.y = 0;
        }
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            fill('#3498db');
            noStroke();
            rect(this.body[i].x * gridSize, this.body[i].y * gridSize, gridSize, gridSize);
        }
    }

    eat(pos) {
        let head = this.body[this.body.length - 1];
        if (head.x === pos.x / gridSize && head.y === pos.y / gridSize) {
            this.grow = true;
            return true;
        }
        return false;
    }

    checkCollision() {
        let head = this.body[this.body.length - 1];
        for (let i = 0; i < this.body.length - 1; i++) {
            let part = this.body[i];
            if (head.x === part.x && head.y === part.y) {
                return true;
            }
        }
        return false;
    }
}

function updateScore() {
    document.getElementById('score').innerText = `⭐ Score: ${score}`;
}

function updateBestScore() {
    document.getElementById('best-score').innerText = `🏆 Meilleur score du jour: ${bestScore}`;
}

function replayGame() {
    gameOver = false;
    score = 0;
    player = new Player();
    foodLocation();
    updateScore();
    document.getElementById('game-canvas').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('replay-button').style.display = 'none';
    loop();
}
