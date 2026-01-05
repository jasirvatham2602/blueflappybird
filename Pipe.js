class Pipe {
    constructor(x) {
        this.x = x;
        this.gap = random(300, 400);
        this.topHeight = random(0, height-this.gap);
        this.bottomHeight = height - (this.topHeight + this.gap); 
        this.topY = this.topHeight/2
        this.bottomY = this.topHeight+this.gap+this.bottomHeight/2;
        rectMode(CENTER);
        this.w = 50;
        this.vel = 10;
    }
    show() {
        fill(0, 0, 255);
        rect(this.x, this.topY, this.w, this.topHeight);
        rect(this.x, this.bottomY, this.w, this.bottomHeight);
    }
    update() {
        this.x -= this.vel;
    }
    offScreen() {
        return this.x - this.w/2 < 0;
    }
}