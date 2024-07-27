var canvas
var bgImg
var database
var form,player,game
var playerCount
var car1,car1Img
var car2,car2Img
var track
var gameState
var allPlayers
var cars=[]
var fuelImg
var powerCoinImg
var obstacle1Img,obstacle2Img
var fuels,powerCoins,obstacles
var lifeImg
var blastImg

function preload(){
bgImg=loadImage("assets/background.png")
car1Img=loadImage("assets/car1.png")
car2Img=loadImage("assets/car2.png")
track=loadImage("assets/track.jpg")
fuelImg=loadImage("assets/fuel.png")
powerCoinImg=loadImage("assets/goldCoin.png")
obstacle1Img=loadImage("assets/obstacle1.png")
obstacle2Img=loadImage("assets/obstacle2.png")
lifeImg=loadImage("assets/life.png")
blastImg=loadImage("assets/blast.png")
}

function setup(){
canvas=createCanvas(windowWidth,windowHeight)
database=firebase.database()
game=new Game()
game.getState()
game.start()
}

function draw(){
background(bgImg)

    if(playerCount===2){
        game.update(1)
    }
    if(gameState===1){
        game.play()
    }

}
 function WindowResized(){
    resizeCanvas(windowWidth,windowHeight)

}
