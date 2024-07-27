class Form{

    constructor(){
        this.input=createInput("").attribute("placeholder","Enter Your Name")
        this.playButton=createButton("Play")
        this.titleImg=createImg("assets/title.png","game title")
        this.greeting=createElement("h2")
    }

    setElementsPosition(){
        this.titleImg.position(120,50)
        this.input.position(width/2-110,height/2-80)
        this.playButton.position(width/2-100,height/2-20)
        this.greeting.position(width/2-300,height/2-100)
    }
    setElementsStyle(){
        this.titleImg.class("gameTitle")
        this.input.class("customInput")
        this.playButton.class("customButton")
        this.greeting.class("greeting")
    }
    display(){
        this.setElementsPosition()
        this.setElementsStyle()
        this.handleMousePressed()
    }
        hide(){
            this.playButton.hide()
            this.greeting.hide()
            this.input.hide()
        }
        handleMousePressed(){
            this.playButton.mousePressed(()=>{
                this.input.hide()
                this.playButton.hide()
                var message=`Hello ${this.input.value()} </br> Waiting for Another Player to Join ....`
                this.greeting.html(message)
                playerCount+=1
                player.name=this.input.value()
                player.index=playerCount
                player.addPlayer()
                player.updateCount(playerCount)
                player.getDistance()
            })
        }
}