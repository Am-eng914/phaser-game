const oldWidth = 800;
const oldHeight = 400;
let gameContainer;

let playerPaddle, aiPaddle, ball;
let upButton, downButton, upText, downText;
let playerScore = 0;
let aiScore = 0;
let playerScoreText, aiScoreText;

let isUpPressed = false;
let isDownPressed = false;
let ballSpeed = 200;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  fps: {target: 60},
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function create() {
  // Create container for all game objects
  gameContainer = this.add.container(0, 0);

  // Player paddle
  playerPaddle = this.add.rectangle(50, oldHeight / 2, 20, 100, 0xffffff);
  this.physics.add.existing(playerPaddle);
  playerPaddle.body.setImmovable(true);

  // AI paddle
  aiPaddle = this.add.rectangle(750, oldHeight / 2, 20, 100, 0xffffff);
  this.physics.add.existing(aiPaddle);
  aiPaddle.body.setImmovable(true);

  // Ball
  ball = this.add.circle(oldWidth / 2, oldHeight / 2, 10, 0xffffff);
  this.physics.add.existing(ball);
  ball.body.setCollideWorldBounds(true, 1, 1);
  ball.body.setBounce(1, 1);
  ball.body.setVelocity(ballSpeed, ballSpeed);

  // Collisions
  this.physics.add.collider(ball, playerPaddle);
  this.physics.add.collider(ball, aiPaddle);

  // Buttons
  upButton = this.add.rectangle(140, 370, 150, 80, 0x5555ff).setInteractive();
  downButton = this.add.rectangle(320, 370, 150, 80, 0x5555ff).setInteractive();

  // Button labels
  upText = this.add.text(108, 365, 'UP', { fontSize: '24px', fill: '#fff' });
  downText = this.add.text(254, 365, 'DOWN', { fontSize: '24px', fill: '#fff' });

  // Score text
  playerScoreText = this.add.text(oldWidth / 4, 50, "Player: 0", { fontSize: '24px', fill: '#fff' });
  aiScoreText = this.add.text((oldWidth * 3) / 4 - 50, 50, "AI: 0", { fontSize: '24px', fill: '#fff' });

  // Add everything to container
  gameContainer.add([playerPaddle, aiPaddle, ball, upButton, downButton, upText, downText, playerScoreText, aiScoreText]);

  // Button events for touch
  upButton.on('pointerdown', () => isUpPressed = true);
  upButton.on('pointerup', () => isUpPressed = false);
  upButton.on('pointerout', () => isUpPressed = false);

  downButton.on('pointerdown', () => isDownPressed = true);
  downButton.on('pointerup', () => isDownPressed = false);
  downButton.on('pointerout', () => isDownPressed = false);

  // Container scaling to current canvas
  const newWidth = this.sys.game.config.width;
  const newHeight = this.sys.game.config.height;

  const scaleX = newWidth / oldWidth;
  const scaleY = newHeight / oldHeight;

  //(full-screen strectching) gameContainer.setScale(scaleX, scaleY);
  
  // uniform streching
  gameContainer.setScale(Math.min(scaleX,scaleY));
  
  // Optional: position top-left
  gameContainer.x = 0;
  gameContainer.y = 0;
}

function update() {
  // Player paddle smooth movement
  if (isUpPressed) playerPaddle.y -= 5;
  if (isDownPressed) playerPaddle.y += 5;

  // Keep paddles inside screen
  playerPaddle.y = Phaser.Math.Clamp(playerPaddle.y, 50, oldHeight - 50);
  aiPaddle.y = Phaser.Math.Clamp(aiPaddle.y, 50, oldHeight - 50);

  // AI paddle movement (simple follow)
  if (ball.y < aiPaddle.y) aiPaddle.y -= 3;
  else if (ball.y > aiPaddle.y) aiPaddle.y += 3;

  // Ball reset and scoring
  if (ball.x <= oldWidth/54) {
    aiScore++;
    aiScoreText.setText("AI: " + aiScore);
    resetBall();
  } else if (ball.x >= oldWidth - 15) {
    playerScore++;
    playerScoreText.setText("Player: " + playerScore);
    resetBall();
  }
}

// Reset ball to center
function resetBall() {
  ball.x = oldWidth / 2;
  ball.y = oldHeight / 2;
  const vx = Math.random() < 0.5 ? ballSpeed : -ballSpeed;
  const vy = (Math.random() * 2 - 1) * ballSpeed;
  ball.body.setVelocity(vx, vy);
}