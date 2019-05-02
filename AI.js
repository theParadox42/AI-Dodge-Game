function AI(x, learn, net) {
	Player.call(this, x);
	if (net) {
		this.net = net.copy();
	} else {
		this.net = new Network([2, 2, 1]);
	}
	this.net.learn(learn || 0);
	this.net.update();
};
AI.prototype = Object.create(Player.prototype);
AI.prototype.displayNet = function() {
	this.net.display(this.x, this.y - this.h / 2, this.w, this.h / 5);
};
AI.prototype.run = function(ob) {
	if (!this.dead) {
		var inD = 0;
		var inH = 0;
		var inU = false;
		if (ob) {
			inD = map(ob.x - this.x, width / 5, 0, 0, 1);
			inH = map(ob.y, -ob.h, -ob.h - 100, 0, 1);
			if (ob.y != -ob.h) {
				inU = true;
			}
		}
		this.net.setInput([inD, inU, inH]);
		this.net.update();
		let out = this.net.getOutput()[0];
		this.input(out);
		this.update();
	}
};
AI.prototype.reset = function(x, l) {
	this.x = x;
	this.vx = this.ovx || this.vx;
	this.vy = 0;
	this.y = -this.h;
	this.net.learn(l || 0);
	this.dead = false;
	this.points = 0;
};


AI.ais = [];
AI.getX = function(i) {
	return -40 * i - 50;
};
AI.init = function(ais) {
	for (var i = 0; i < round(ais / 2) * 2; i++) {
		this.ais.push(new this(this.getX(i), 0));
	}
}
AI.run = function() {
	for (var i = this.ais.length - 1; i > -1; i--) {
		var ai = this.ais[i];
		var nearest = false;
		var nearestDistance = width * width;
		for (var j = 0; j < Obstacle.obstacles.length; j++) {
			var o = Obstacle.obstacles[j];
			if (o.x > ai.x + ai.w && abs(o.x - ai.x) < nearestDistance) {
				nearest = o;
				nearestDistance = abs(o.x - ai.x);
			}
		}
		ai.run(nearest);
	}
}
AI.display = function(){
	for(var i = 0; i < this.ais.length; i ++){
		if(!this.ais[i].dead){
			this.ais[i].display();
			this.ais[i].displayNet();
		}
	}
};
AI.dead = function() {
	var dead = true;
	for (var i = 0; i < this.ais.length; i++) {
		if (!this.ais[i].dead) {
			dead = false;
		}
	}
	return dead;
}
AI.reset = function() {
	this.ais.sort(function(ai1, ai2) {
		return ai2.points - ai1.points;
	})
	var l = this.ais.length / 2;
	for (var i = 0; i < l; i++) {
		this.ais.pop();
	}
	l = this.ais.length;
	for (var i = 0; i < l; i++) {
		var r = 1;
		this.ais[i].reset(this.getX(i), r);
		this.ais.push(new this(this.getX(i + l), r, this.ais[i].net));
	}
	this.ais[this.ais.length-1] = new this(this.getX(this.ais.length-1), 0);
}
