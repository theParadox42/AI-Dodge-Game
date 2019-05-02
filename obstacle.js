function Obstacle(x) {
	this.x = x;
	this.w = 50;
	this.h = 40;
	this.y = -this.h + (round(Math.random()) == 0 ? 0 : -60);
}
Obstacle.prototype.display = function() {
	push();
	noStroke();
	fill(0);
	rect(this.x, this.y, this.w, this.h, 6);
	fill(255);
	ellipse(this.x+this.w/2,this.y+this.h/2, min(this.w,this.h)-5, min(this.w, this.h)-5);
	pop();
}
Obstacle.prototype.collide = function(p) {
	if (p.x + p.w > this.x && p.x < this.x + this.w && p.y + p.h > this.y && p.y < this.y + this.h) {
		p.dead = true;
	}
}
Obstacle.obstacles = [];
Obstacle.reload = 150;
Obstacle.count = Obstacle.reload / 2;
Obstacle.add = function() {
	this.obstacles.push(new this(transPoint.x + width / 2));
};
Obstacle.run = function(players) {
	for (var i = this.obstacles.length - 1; i > -1; i--) {
		var o = this.obstacles[i];
		for (var j = 0; j < players.length; j++) {
			o.collide(players[j]);
		}
		if (o.x + o.w < -width / 2 + transPoint.x) {
			this.obstacles.splice(i, 1);
		}
	}
	this.count--;
	if (this.count <= 0) {
		this.add();
		this.count = Math.random() * 20 + this.reload;
		this.reload -= 5;
		this.reload = max(this.reload, 40);
	}
};
Obstacle.display = function(){
	for(var i = 0; i < this.obstacles.length; i++){
		this.obstacles[i].display();
	}
};