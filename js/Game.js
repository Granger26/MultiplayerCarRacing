class Game{

    constructor(){
        this.resetTitle=createElement("h2")
        this.resetButton=createButton("")
        this.leaderBoardTitle=createElement("h2")
        this.leader1=createElement("h2")
        this.leader2=createElement("h2")
        this.playerMoving=false
        this.leftKeyActive=false
        this.blast=false
    }

    start(){
        player=new Player()
        playerCount=player.getCount()
        form=new Form()
        form.display()

        car1=createSprite(width/2-100,height-100)
        car1.addImage(car1Img)
        car1.scale=0.07
        car1.addImage("blast",blastImg)

        car2=createSprite(width/2+100,height-100)
         car2.addImage(car2Img)
        car2.scale=0.07
        car2.addImage("blast",blastImg)


        cars=[car1,car2]
        
        fuels=new Group()
        powerCoins=new Group()
        obstacles=new Group()

        var obstaclesPositions=[
            {x:width/2+250,y:height-800,image:obstacle2Img },
            {x:width/2-150,y:height-1300,image:obstacle1Img },
            {x:width/2+250,y:height-1800,image:obstacle1Img },
            {x:width/2-180,y:height-2300,image:obstacle2Img },
            {x:width/2,y:height-2800,image:obstacle2Img },
            {x:width/2-180,y:height-3300,image:obstacle1Img },
            {x:width/2+250,y:height-3300,image:obstacle2Img },
            {x:width/2+250,y:height-3800,image:obstacle2Img },
            {x:width/2-150,y:height-4300,image:obstacle1Img },
            {x:width/2+250,y:height-4800,image:obstacle2Img },
            {x:width/2,y:height-5300,image:obstacle1Img },
            {x:width/2-180,y:height-5500,image:obstacle2Img },
        ]

        this.addSprites(fuels,4,fuelImg,0.02)
        this.addSprites(powerCoins,18,powerCoinImg,0.09)
        this.addSprites(obstacles,obstaclesPositions.length,obstacle1Img,0.04,obstaclesPositions)

        }

    getState(){
        database.ref("gameState").on("value",(data)=>{
            gameState=data.val()
        })
    }

    update(state){
        database.ref("/").update({
            gameState:state
        })
    }

    handleElements(){
        form.hide()
        form.titleImg.position(40,50)
        form.titleImg.class("gameTitleAfterEffect")
        this.resetTitle.html("Reset Game")
        this.resetTitle.class("resetText")
        this.resetTitle.position(width/2+200,40)
        this.resetButton.class("resetButton")
        this.resetButton.position(width/2+230,100)
        this.leaderBoardTitle.html("Leader Board")
        this.leaderBoardTitle.class("resetText")
        this.leaderBoardTitle.position(width/3-60,40)
        this.leader1.class("leadersText")
        this.leader1.position(width/3-50,80)
        this.leader2.class("leadersText")
        this.leader2.position(width/3-50,130)
    }

    

    play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayerInfo()
    player.getCarsAtEnd()
        if(allPlayers!==undefined){
            image(track,0,-height*5,width,height*6)
            this.showLeaderBoard()
            this.showLife()
            this.showFuelBar()
            var index=0
            for(var plr in allPlayers){
                index++
                var x=allPlayers[plr].positionX
                var y=height-allPlayers[plr].positionY
                var currentLife=allPlayers[plr].life
                if(currentLife<=0){
                    cars[index-1].changeImage("blast")
                    cars[index-1].scale=0.3
                }
                cars[index-1].position.x=x
                cars[index-1].position.y=y

                if(index===player.index){
                    stroke(0)
                    fill("red")
                    ellipse(x,y,60,60)
                    this.handleFuel(index)
                    this.handlePowerCoins(index)
                    this.handleObstacleCollision(index)
                    this.handleCarACollisionWithCarB(index)
                    if(player.life<=0){
                        this.blast=true
                        this.playerMoving=false
                        this.gameOver()
                    }
                    camera.position.x=cars[index-1].position.x
                    camera.position.y=cars[index-1].position.y
                }

            }
            if(this.playerMoving){
                player.positionY+=5
                player.update()
            }
            this.handlePlayerControls()
            const finishLine=height*6-100
            if(player.positionY>finishLine){
                gameState=2
                player.rank+=1
                Player.updateCarsAtEnd(player.rank)
                player.update()
                this.showRank()
            }

            drawSprites()
        }
    }

    handlePlayerControls(){
        if(!this.blast){

        if(keyIsDown(UP_ARROW)){
            this.playerMoving=true
                player.positionY+=10
                player.update()
        }
        if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-51 ){
            this.leftKeyActive=true
            player.positionX-=5
            player.update()
        }
        if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
            this.leftKeyActive=false
            player.positionX+=5
            player.update()
        }
    }

    }

    showLeaderBoard(){
        var leader1,leader2
        var players=Object.values(allPlayers)
        if((players[0].rank===0 && players[1].rank===0 ) || players[0].rank===1){
            leader1=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
            leader2=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
    }
    if(players[1].rank===1){
        leader1=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
        leader2=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
    }
    this.leader1.html(leader1)
 this.leader2.html(leader2)
}

    handleResetButton(){
         this.resetButton.mousePressed(()=>{
            database.ref("/").set({
                gameState:0,
                playerCount:0,
                players:{},
                carsAtEnd:0

            })
            window.location.reload()
         })
    }


    addSprites(spriteGroup,numberOfSprites,spriteImg,scale,positions=[]){
        for(var i=0;i<numberOfSprites;i++){
            var x,y
            if(positions.length>0){
                x=positions[i].x
                y=positions[i].y
                spriteImg=positions[i].image
            }
            else{
                x=random(width/2+150,width/2-150)
                y=random(-height*4.5,height-400)
    
            }
            var sprite=createSprite(x,y)
            sprite.addImage(spriteImg)
            sprite.scale=scale
            spriteGroup.add(sprite)
        }
}

     handleFuel(index){
        cars[index-1].overlap(fuels,function(collecter,collected){
            player.fuel=185
            collected.remove()
            
        })
        if(player.fuel>0 && this.playerMoving){
            player.fuel-=0.3
        }
        if(player.fuel<=0){
            gameState=2
            this.gameOver()
        }
     }

     handlePowerCoins(index){
        cars[index-1].overlap(powerCoins,function(collecter,collected){
            player.score+=20
            player.update()
            collected.remove()
            
        })
     }

     showRank(){
        swal({
            title:`Awsome!!! ${"\n"}Rank${"\n"}${player.rank}`,
            text:"You Reached The Finish Line Succsesfully",
            imageUrl:"assets/Cup2.png",
            imageSize:"100x100",
            confirmButtonText:"OK"

        })
     }

     
     showLife(){
        push()
        image(lifeImg,width/2-130,height-player.positionY-350,20,20)
        fill(255)
        rect(width/2-100,height-player.positionY-350,185,20)
        fill("#f50057")
        rect(width/2-100,height-player.positionY-350,player.life,20)
        noStroke()
        pop()
     }

     showFuelBar(){
        push()
        image(fuelImg,width/2-130,height-player.positionY-300,20,20)
        fill(255)
        rect(width/2-100,height-player.positionY-300,185,20)
        fill("#ffc400")
        rect(width/2-100,height-player.positionY-300,player.fuel,20)
        noStroke()
        pop()
     }

     gameOver(){
        swal({
            title:"Game Over",
            text:"Oops! You Lost The Game",
            imageUrl:"assets/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.webp",
            imageSize:"100x100",
            confirmButtonText:"Thanks For Playing"
        })
     }

     handleObstacleCollision(index){
        if(cars[index-1].collide(obstacles)){
            if(this.leftKeyActive){
                player.positionX+=100
            }
            else{
                player.positionX-=100
            }
            if(player.life>0){
                player.life-=185/4

            }
            player.update()
        }
     }

     handleCarACollisionWithCarB(index){
        if(index===1){
            if(cars[index-1].collide(cars[1])){
                if(this.leftKeyActive){
                    player.positionX+=100
                }
                else{
                    player.positionX-=100
                }
                if(player.life>0){
                    player.life-=185/4

                }
                player.update()
            }
        }
        if(index===2){
            if(cars[index-1].collide(cars[0])){
                if(this.leftKeyActive){
                    player.positionX+=100
                }
                else{
                    player.positionX-=100
                }
                if(player.life>0){
                    player.life-=185/4
                }
                player.update()
            }

        }
     }
}