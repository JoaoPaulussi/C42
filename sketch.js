var canvas;
var backgroundImage,car1_img,car2_img,pista;
var bgImg;
var database,gameState;
var allPlayers,car1,car2,fuels,coins,obstacles;
var cars = [];
var form, player;
var playerCount;
var fuelImage,coinsImage,obstacle1Image,obstacle2Image,lifeImage,blastImage;

function preload(){
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  pista = loadImage("../assets/PISTA.png");
  fuelImage = loadImage("./assets/fuel.png");
  coinsImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");
}

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);
  database = firebase.database();
  game = new Game();
  game.start();
  game.getState();
}

function draw(){
  background(backgroundImage);
  if(playerCount === 2){
    game.update(1);
  }
  if(gameState === 1){
    game.play();
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}