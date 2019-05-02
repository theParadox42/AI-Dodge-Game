var transPoint = new Player(0);

var speedMult = 15;
var defSpeedMult = speedMult;

var canvas;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight)
	background(200, 225, 255);
	AI.init(15);
};

function draw() {
	
	if(mouseIsPressed){
		speedMult = 2;
	} else {
		speedMult = defSpeedMult;
	}
	
	updateCanvas();

	background(200, 225, 255);

	translate(width / 2, height / 2);
	
	for(var i = 0; i < speedMult; i ++){
		if(i!=0){
			frameCount++;
		}
		
		transPoint.update();
		player.run();
		AI.run();
		Obstacle.run([player].concat(AI.ais))

		if (player.dead && AI.dead()) {
			reset();
		}

	}
	
	push();
	translate(-transPoint.x, 0);
	
	player.display();
	AI.display();
	Obstacle.display();
	
	pop();
	
	push();
	fill(100, 60, 0);
	stroke(0,200,0);
	strokeWeight(3);
	rect(-width / 2-2, 0, width+4, height / 2 + 20);
	pop();

	resetMatrix();
};

function reset() {
	player = new Player(0);
	AI.reset();
	transPoint = new Player(0);
	Obstacle.reload = 150;
	Obstacle.obstacles = [];
};

function updateCanvas() {
	// if(canvas.height != windowHeight || canvas.width != windowWidth){
	resizeCanvas(windowWidth, windowHeight)
	// }
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
};


function mouseReleased() {
	if (!fullscreen()) {
		fullscreen(true);
	}
};
