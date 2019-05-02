//================//
//SIGMOID FUNCTION//
//================//

{

	function sigmoid(t) {
		return 1/(1+Math.pow(Math.E, -t));
	};

}

//================//
//NEURONS or NODES//
//================//

{

	function Node(bias, index, outOf){
		this.bias = bias;
		this.index = index;
		this.outOf = outOf;
		this.val = 0;
		this.inputs = [];
		this.weights = [];
	};
	Node.prototype.set = function(val){
		this.val = val;
	};
	Node.prototype.addInput = function(inNode){
		var inputIndex = this.inputs.length;
		this.inputs.push(inNode);
		this.weights[inputIndex] = this.weights[inputIndex] || Math.random() * 10 - 5;
	};
	Node.prototype.update = function(){
		var val = 0;
		for(var i = 0; i < this.inputs.length; i ++){
			val += (this.inputs[i].val||0)*(this.weights[i]||0);
		}
		this.val = sigmoid(val);
	};
	Node.prototype.display = function(x,y,d){
		fill(this.val*255);
		ellipse(x,y,d,d);
	};
	Node.prototype.randomize = function(a){
		function v(){
			return Math.random() * a - a/2;
		}
		this.bias += v()/10;
		for(var i = 0; i < this.weights.length; i ++){
			this.weights[i] = constrain(this.weights[i]+v(),-10,10);
		}

	};
	Node.prototype.copy = function(){
		var newNode = new Node(this.bias,this.index,this.outOf);
		newNode.val = this.val;
		for(var i = 0; i < this.weights.length; i ++){
			newNode.weights[i] = this.weights[i];
		}
		return newNode;
	};

}

//================//
// NETWORK LAYERS //
//================//

{

	function Layer(nodes){
		this.nodes = [];
		for(var i = 0; i < nodes; i ++){
			this.nodes[i] = new Node(Math.random()*2-1, i, nodes);
		}
		this.inputLayer = [];
	};
	Layer.prototype.set = function(arr){
		for(var i = 0; i < this.nodes.length; i ++){
			if(arr[i] != undefined){
				this.nodes[i].val = arr[i] || 0;
			}
		}
	};
	Layer.prototype.setInput = function(layer){
		this.inputLayer = layer;
		for(var i = 0; i < this.nodes.length; i ++){
			for(var j = 0; j < layer.nodes.length; j ++){
				this.nodes[i].addInput(layer.nodes[j]);
			}
		}
	};
	Layer.prototype.update = function(){
		for(var i = 0; i < this.nodes.length; i ++){
			this.nodes[i].update();
		}
	};
	Layer.prototype.display = function(x,my,px,h){
		var nh = h;
		for(var i = 0; i < this.nodes.length; i ++){
			for(var j = 0; j < this.nodes[i].inputs.length; j ++){
				var w = this.nodes[i].weights[j];

				strokeWeight(abs(w)*nh/50);
				if(w>0){
					stroke(0, 255, 0);
				} else {
					stroke(255, 0, 0);
				}
				var n = this.nodes[i].inputs[j];
				var mn = this.nodes[i];
				line(px,map(n.index,0,n.outOf,-n.outOf*nh,n.outOf*nh)+my,x,map(mn.index,0,mn.outOf,-mn.outOf*nh,mn.outOf*nh)+my);
			}
		}
		strokeWeight(nh/20);
		stroke(0);
		for(var i = 0; i < this.nodes.length; i ++){
			fill(this.val*255);
			var mn = this.nodes[i];
			var y = map(mn.index,0,mn.outOf,-mn.outOf*nh,mn.outOf*nh)+my;
			this.nodes[i].display(x,y,nh);
		}
	};
	Layer.prototype.get = function(){
		var out = [];
		for(var i = 0; i < this.nodes.length; i ++){
			out.push(this.nodes[i].val);
		}
		return out;
	};
	Layer.prototype.evolve = function(learn){
		for(var i = 0; i < this.nodes.length; i ++){
			this.nodes[i].randomize(learn);
		}
	};
	Layer.prototype.copy = function(){
		var newLay = new Layer(0);
		for(var i = 0; i < this.nodes.length; i ++){
			newLay.nodes[i] = this.nodes[i].copy();
		}
		return newLay;
	};

}

//================//
// NEURAL NETWORK //
//================//

{

	function Network(layers) {
		if(!(layers instanceof Array)){
			return alert("Not a valid array!");
		} else if(layers.length < 2) {
			return alert("Not enough layers for a Network");
		}
		this.inputLayer = new Layer(layers[0]);
		this.outputLayer = new Layer(layers[layers.length-1]);
		this.hiddenLayers = [];
		if(layers.length > 2) {
			for(var i = 0; i < layers.length-2; i ++){
				this.hiddenLayers[i] = new Layer(layers[i+1]);
				if(i == 0){
					this.hiddenLayers[i].setInput(this.inputLayer)
				} else {
					this.hiddenLayers[i].setInput(this.hiddenLayers[i-1]);
				}
			}
			this.outputLayer.setInput(this.hiddenLayers[this.hiddenLayers.length-1]);
		} else {
			this.outputLayer.setInput(this.inputLayer);
		}
	};
	Network.prototype.setInput = function(data){
		this.inputLayer.set(data);
	};
	Network.prototype.getOutput = function() {
		return this.outputLayer.get();
	};
	Network.prototype.update = function(){
		for(var i = 0; i < this.hiddenLayers.length; i ++){
			this.hiddenLayers[i].update();
		}
		this.outputLayer.update();
	};
	Network.prototype.display = function(x,my,w,nh) {
		var layers = 2 + this.hiddenLayers.length;
		var sw = w/(layers-1);
		this.outputLayer.display(x+w,my,x+w-sw,nh);
		for(var i = this.hiddenLayers.length-1; i > -1; i --){
			this.hiddenLayers[i].display(x+i*sw+sw, my, x+i*sw, nh);
		}
		this.inputLayer.display(x,my,x-sw,nh);
	};
	Network.prototype.learn = function(learn){
		for(var i = 0; i < this.hiddenLayers.length; i ++){
			this.hiddenLayers[i].evolve(learn);
		}
		this.outputLayer.evolve(learn);
		this.update();
	};
	Network.prototype.copy = function(){
		var newNet = new Network([0,0]);
		newNet.inputLayer = this.inputLayer.copy();
		newNet.outputLayer = this.outputLayer.copy();
		if(this.hiddenLayers.length>0){
			for(var i = 0; i < this.hiddenLayers.length; i ++){
				newNet.hiddenLayers[i] = this.hiddenLayers[i].copy();
				if(i == 0){
					newNet.hiddenLayers[i].setInput(newNet.inputLayer);
				} else {
					newNet.hiddenLayers[i].setInput(newNet.hiddenLayers[i-1]);
				}
			}
			newNet.outputLayer.setInput(newNet.hiddenLayers[newNet.hiddenLayers.length-1]);
		} else {
			newNet.outputLayer.setInput(newNet.inputLayer);
		}
		return newNet;
	};

}