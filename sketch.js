let player;
let obstacles = [];
let groundHeight = 50;
let gravity = 1;
let jumpForce = -15;
let gameOver = false; // ゲームオーバーのフラグ
let gameStarted = false; // ゲーム開始フラグ
let startButton; // スタートボタンの変数
let restartButton; // やり直しボタンの変数

function setup() {
  createCanvas(800, 400);
  player = new Player();
  obstacles.push(new Obstacle());

  // スタートボタンの作成
  startButton = createButton("ゲームスタート");
  startButton.position(width / 2 - 35, height / 2 - 17);

  startButton.mousePressed(startGame);

  restartButton = createButton("再チャレンジ");
  restartButton.position(width / 2 - 50, height / 2); // ボタンの位置
  restartButton.mousePressed(restartGame); // ボタンが押されたときの処理
  restartButton.hide(); // 初めは非表示にする
}

function draw() {
  background(220);

  // 地面を描画
  fill(100);
  rect(0, height - groundHeight, width, groundHeight);

  if (gameStarted) {
    if (!gameOver) {
      // プレイヤーの更新と表示
      player.update();
      player.show();

      // 障害物の更新と表示
      if (frameCount % 60 === 0) {
        obstacles.push(new Obstacle());
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].show();

        // プレイヤーが障害物に当たったか確認
        if (obstacles[i].hits(player)) {
          gameOver = true; // 当たったらゲームオーバーにする
          console.log("Game Over");
        }

        // 画面外に出た障害物を削除
        if (obstacles[i].offscreen()) {
          obstacles.splice(i, 1);
        }
      }
    } else {
      // ゲームオーバーの表示
      textSize(50);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text("Game Over", width / 2, height / 2 - 40);

      // やり直しボタンを表示
      restartButton.show();
    }
  } else {
    // ゲームが開始されていないときのメッセージ
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text(
      "ゲームを始めるにはボタンを押してください",
      width / 2,
      height / 2 - 40
    );
  }
}

function startGame() {
  gameStarted = true; // ゲームを開始
  obstacles = []; // 障害物リセット
  gameOver = false; // ゲームオーバー状態をリセット
  startButton.hide(); // スタートボタンを非表示にする
}

function restartGame() {
  obstacles = []; // 障害物リセット
  gameOver = false; // ゲームオーバー状態をリセット
  player = new Player(); // プレイヤーを初期化
  restartButton.hide(); // やり直しボタンを非表示
}

function keyPressed() {
  if (key === " " && player.onGround() && gameStarted && !gameOver) {
    player.jump();
  }
}

// プレイヤー（恐竜）のクラス
class Player {
  constructor() {
    this.size = 40;
    this.x = 50;
    this.y = height - groundHeight - this.size;
    this.velocityY = 0;
  }

  update() {
    this.velocityY += gravity;
    this.y += this.velocityY;

    // 地面に着地した場合、Y座標を固定
    if (this.y > height - groundHeight - this.size) {
      this.y = height - groundHeight - this.size;
      this.velocityY = 0;
    }
  }

  jump() {
    this.velocityY = jumpForce;
  }

  onGround() {
    return this.y === height - groundHeight - this.size;
  }

  show() {
    fill(50);
    rect(this.x, this.y, this.size, this.size);
  }
}

// 障害物のクラス
class Obstacle {
  constructor() {
    this.width = 20;
    this.height = random(30, 70);
    this.x = width;
    this.y = height - groundHeight - this.height;
    this.speed = 6;
  }

  update() {
    this.x -= this.speed;
  }

  hits(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.size > this.x &&
      player.y < this.y + this.height &&
      player.y + player.size > this.y
    );
  }

  offscreen() {
    return this.x < -this.width;
  }

  show() {
    fill(150, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  }
}
