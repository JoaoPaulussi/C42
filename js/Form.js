class Form{
  constructor(){
    this.input = createInput("").attribute("placeholder","Digite Seu nome");
    this.playerButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png","Nome do Jogo");
    this.greeting = createElement("h2");
  }

  setElementsPosition(){
    this.titleImg.position(120,50);
    this.input.position(width/2-110,height/2-80);
    this.playerButton.position(width/2-90,height/2-20);
    this.greeting.position(width/2-300,height/2-100);
  }
  setElementsStyle(){
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playerButton.class("customButton");
    this.greeting.class("greeting");
  }
  handleMousePressed(){
    this.playerButton.mousePressed(()=>{
      this.input.hide();
      this.playerButton.hide();
      var message = `Olá, ${this.input.value()}
      <br>Espere o outro jogador entrar...`
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    })
  }
  display(){
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
  hide(){
    this.greeting.hide();
    this.playerButton.hide();
    this.input.hide();
  }
}