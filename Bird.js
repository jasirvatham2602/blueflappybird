class Bird {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.vel = 0;
        this.g = .5;
        this.score = 0;
        this.brain = new NeuralNetwork(4, 30, 1);
        this.humanInControl = true;
        this.magicScore = 8;
        this.trainingData = [];
        this.framesAIinControl = 0;
    }
    show() {
        fill(255,0,0);
        ellipse(this.x, this.y, this.w*2, this.w*2);
    }
    update() {
        this.y += this.vel;
        this.vel += this.g;
        if (this.y + this.w > height) {
            this.y = height - this.w;
        }
        if (this.y - this.w < 0) {
            this.y = this.w;
            this.vel = Math.max(0, this.vel);
        }
        if (this.score > this.magicScore) {
            this.humanInControl = false;
            this.framesAIinControl++;
            if (this.framesAIinControl == 1) {
                // the exact moment the score reaches the magicScore, 
                // the AI retrains everything it learned
                this.trainAgain();
            }
        }else {
        }
    }
    jump(pipe) {
        /*  Human in control when score less than 3*/
        if (this.score <= this.magicScore && keyIsDown(32)) {
            this.vel = -10;
        }else if (this.score > this.magicScore) {
             //input
             let horizontalDistanceFromPipe = abs(pipe.x - this.x)/width;
             let birdYLocation = this.y/height;
             let topPipeY = pipe.topY/height;
             let bottomPipeY = pipe.bottomY/height;

             let input = [horizontalDistanceFromPipe, birdYLocation, topPipeY, bottomPipeY];
             let output = this.brain.predict(input);
             if (output > .5) {
                this.vel = -10;
             }
        }
    }
    isJumpedPressed() {
        if (this.score <= this.magicScore && keyIsDown(32)) {
            return 1;
        }else {
            return 0;
        }

    }
    collides(pipe) {
        let inX = abs(pipe.x- this.x) < this.w + pipe.w/2;
        let inYTop = abs(pipe.topY- this.y) < this.w + pipe.topHeight/2;
        let inYBottom = abs(pipe.bottomY- this.y) < this.w + pipe.bottomHeight/2;
        return inX && inYTop || (inX && inYBottom);
    }
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
    train(pipe) {
        if (this.humanInControl) {
            //input
            let horizontalDistanceFromPipe = abs(pipe.x - this.x)/width;
            let birdYLocation = this.y/height;
            let topPipeY = pipe.topY/height;
            let bottomPipeY = pipe.bottomY/height;
            // output
            let isJumping = this.isJumpedPressed();// 0 = false, 1 = true
            // the data
            let data = {
                inputs: [horizontalDistanceFromPipe, birdYLocation, topPipeY, bottomPipeY],
                outputs: [isJumping],
            };
            this.trainingData.push(data);
            this.brain.train(data.inputs, data.outputs);
            
            
            
        }
    }
    trainAgain() {
        for (let i = 0; i < 100000*3; i++) {
            let data = random(this.trainingData);
            this.brain.train(data.inputs, data.outputs);

        }
    }
}