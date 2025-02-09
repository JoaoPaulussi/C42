class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value",function(data){
      gameState = data.val();
    })
  }

  update(state){
    database.ref("/").update({
      gameState:state
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2-50,height-100);
    car1.addImage("car1",car1_img);
    car1.scale=0.07;
    car1.addImage("blast", blastImage);
    car2 = createSprite(width/2+100,height-100);
    car2.addImage("car2",car2_img);
    car2.scale=0.07;
    car2.addImage("blast", blastImage);
    cars = [car1,car2];
    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      {x:width/2 + 250,y:height - 800,image:obstacle1Image},
      {x:width/2 - 200,y:height - 1200,image:obstacle2Image},
      {x:width/2 - 170,y:height - 1500,image:obstacle1Image},
      {x:width/2 + 150,y:height - 1600,image:obstacle2Image},
      {x:width/2,y:height - 840,image:obstacle1Image},
      {x:width/2 - 230,y:height - 2000,image:obstacle2Image},
      {x:width/2 + 190,y:height - 1350,image:obstacle1Image},
      {x:width/2 - 240,y:height - 1000,image:obstacle2Image},
      {x:width/2 - 160,y:height - 2500,image:obstacle1Image},
      {x:width/2 + 180,y:height - 2300,image:obstacle2Image},
      {x:width/2,y:height - 800,image:obstacle1Image},
      {x:width/2 - 240,y:height - 1150,image:obstacle2Image},
    ]

    this.addSprites(fuels,4,fuelImage,0.02);
    this.addSprites(coins,18,coinsImage,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }
    addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]){
      for(var i = 0; i<numberOfSprites;i++){
        var x,y;
        if(positions.length>0){
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        }else{
          x = random(width/2 + 150,width/2 - 150);
          y = random(-height *4.5,height-400);
        }
        var sprite = createSprite(x,y);
        sprite.addImage("sprite",spriteImage);
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }
  handleElements(){
    form.hide();
    form.titleImg.position(40,10);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200,40);
    
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 +230,100);

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3 -60,40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 -50,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 -50,130);

  }
  play(){
    this.handleResetButton();
    this.handleElements();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if(allPlayers !== undefined){
      image(pista, 0, -height*5,width,height*6);
      this.showLeaderboard();
      this.showLife();
      this.showFuelBar();
      var index = 0;
      for(var plr in allPlayers){
        index = index +1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var currentLife = allPlayers[plr].life;

        if(currentLife<=0){
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("black");
          ellipse(x,y,60,60);

          this.handleFuel(index);
          this.handleCoins(index);
          this.handleObstacleCollision(index);
          this.handleCarCollisionWithCarB(index);

          if(player.life<=0){
            this.blast = true;
            this.playerMoving = false;
          }

          //camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      if(this.playerMoving){
        player.positionY+=5;
        player.update();
      }
      this.handlePlayerControls();
      const finishLine = height*6-100;
      if(player.positionY>finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites();
    }
  }
  handlePlayerControls(){
    if(!this.blast){

    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)&& player.positionX>width/3-50){
      this.leftKeyActive = true;
      player.positionX -= 5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW)&& player.positionX<width/2+300){
      this.leftKeyActive = false;
      player.positionX += 5;
      player.update();
    }
  }

  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        carsAtEnd:0,
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0
      })
      window.location.reload();
    })
  }
  showLife(){
    push();
    image(lifeImage,width/2-130,height-player.positionY-280,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-280,185,20);
    fill("red");
    rect(width/2-100,height-player.positionY-280,player.life,20);
    noStroke();
    pop();
  }
  showFuelBar(){
    push();
    image(fuelImage,width/2-130,height-player.positionY-250,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-250,185,20);
    fill("gray");
    rect(width/2-100,height-player.positionY-250,player.fuel,20);
    noStroke();
    pop();
  }
  showLeaderboard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    if((players[0].rank=== 0 && players[1].rank === 0)||players[0].rank === 1){
      leader1 = players[0].rank + "&emsp;"+
      players[0].name + "&emsp;"+
      players[0].score;

      leader2 = players[1].rank + "&emsp;"+
      players[1].name + "&emsp;"+
      players[1].score;
    }
    if(players[1].rank === 1){
      leader1 = players[1].rank + "&emsp;"+
      players[1].name + "&emsp;"+
      players[1].score;

      leader2 = players[0].rank + "&emsp;"+
      players[0].name + "&emsp;"+
      players[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel = 185;
      collected.remove();
    })
    if(player.fuel>0 && this.playerMoving){
        player.fuel -= 0.5;
      }
      if(player.fuel<=0){
        gameState = 2;
        this.gameOver();
      }
    
  }

  handleCoins(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score += 10;
      player.update();
      collected.remove();
      
    })
  }
  handleObstacleCollision(index){
    if(cars[index-1].collide(obstacles)){
      if(this.leftKeyActive){
        player.positionX += 100;
      }else{
        player.positionX -= 100;
      }
      if(player.life>0){
        player.life -= 185/3;
      }
      player.update();
    }
  }
  handleCarCollisionWithCarB(index){
    if(index===1){
      if(cars[index-1].collide(cars[1])){
        if(this.leftKeyActive){
          player.positionX+=100;
        }else{
          player.positionX-=100;
        }
        if(player.life>0){
          player.life-=185/3;
        }
        player.update();
      }
    }
    if(index===2){
      if(cars[index-1].collide(cars[0])){
        if(this.leftKeyActive){
          player.positionX+=100;
        }else{
          player.positionX-=100;
        }
        if(player.lif>0){
          player.life-=185/3;
        }
        player.update();
      }
    }
  }
  showRank(){
    swal({
      title:`Parabéns!${"\n"}${player.rank}º lugar`,
      text:"Você chegou na linha de chegada",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"Ok"
    })
  }
    gameOver(){
      swal({
        title:`Fim de Jogo`,
        text:"Continue tentando!",
        imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize:"100x100",
        confirmButtonText:"Obrigado por jogar!"
      })
  }
  end(){
    console.log("Fim de Jogo");
  }
}