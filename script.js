let training_data = [
    {
        inputs:[0,0],
        outputs:[0],
    },
    {
        inputs:[0,1],
        outputs:[0],
    },
    {
        inputs:[1,0],
        outputs:[0],
    },
    {
        inputs:[1,1],
        outputs:[1],
    },
];
/*
GOAL: 

Human plays the game till the score reaches 3. During this time, 
the AI trains itself on the decisions the human made. Since the human
was able to survive for a long period of time (3 pipes), the AI, should 
learn well, and last a long time. 
InputSize: 4 (horizontalDistanceFromPipe, birdYLocation, topPipeY, bottomPipeY)
HiddenLayerNuerons: 10
OutputLayerNuerons: 1, if >.5 jump, if less < .5 don't jump 
*/  
let brain;
let bird;
let pipes = [];
let pause; 
function setup() {
    createCanvas(600, 600);
    bird = new Bird(width/2, height/2);
    console.log("DONE!");
    frameRate(30);
    generatePipe();
    pause = false;
    textAlign(CENTER);
}
  
function generatePipe() {
    pipes = []
    let pipe = new Pipe(width+50);
    pipes.push(pipe);
}
function draw() {
    if (pipes.length == 0) {
        generatePipe()
    }
    background(225);
    fill(255,0,0);
    noStroke();
    bird.show();
    bird.update();
    // bird.jump();

    strokeWeight(5);
    stroke(0)
    fill(0);
    textSize(15);
    for (let pipe of pipes) {
        pipe.show();
        pipe.update();
        if (pipe.offScreen()) {
            generatePipe();
            bird.score++;
        }
        if (bird.collides(pipe)) {
            pause = true;
            noLoop();
            fill(0,255,0);
            text("GAME OVER", width/2, 3*height/12)
        }
        // jumping
        bird.jump(pipe)
        // training bird
        bird.train(pipe);
    }
    
    fill(0, 255, 0);
    textSize(15);
    text("Score: " + bird.score, width/2, height/6)
    if (mouseIsPressed) {
        pause = !pause;
    }
    
    if (pause) {
        noLoop();
    }else {
        loop();
    }
    
    
    
}
