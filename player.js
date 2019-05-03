function Player(x){
    this.x = x;
    this.w = 30;
    this.h = this.w;
    this.y = -this.h;
    this.vx = 5;
    this.ovx = this.vx;//original vx
    this.vy = 0;
    this.px = this.x - this.vx;
    this.py = this.y - this.vy;
    this.color = "rgb(" + Math.round(Math.random() * 150 + 50) + ", "
                + Math.round(Math.random() * 150 + 50) +", "
                + Math.round(Math.random() * 150 + 50) + ")";
    this.dead = false;
    this.points = 0;
};
Player.prototype.input = function(jump){
    if((typeof jump) == "number"){
        if(jump > 0.6) {
            this.jump();
        }
    } else if(jump) {
        this.jump();
    }
};
Player.prototype.jump = function(){
    if(this.y >= -this.h) {
        this.vy-=6;
    }
};
Player.prototype.update = function(){
    this.px = this.x;
    this.py = this.y;
    this.vy+=0.2;
    this.vx+=0.001;
    this.x+=this.vx;
    this.y+=this.vy;
    if(this.y >= -this.h){
        this.y = -this.h;
        this.vy = min(this.vy,0);
    }
    if(frameCount%20==0&&this.x>0){
        this.points ++;
    }
};
Player.prototype.display = function(){
	if(!this.dead){
	    push();

	    noStroke();
	    fill(this.color);
	    rect(this.x, this.y, this.w, this.h, 5);

	    fill(255);
	    textSize(15);
	    textAlign(CENTER,CENTER);
	    text(this.points, this.x+this.w/2, this.y+this.h/2)

	    pop();
	}
};
Player.prototype.run = function(){
    if(!this.dead){
        this.input(keyIsPressed||mouseIsPressed);
        this.update();
    }
};

let player = new Player(0, 0);
