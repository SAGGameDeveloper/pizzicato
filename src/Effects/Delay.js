Pizzicato.Effects.Delay = function(options) {
	
	this.options = options || {};

	var defaults = {
		repetitions: 5,
		time: 0.3,
		mix: 0.5
	};

	for (var key in defaults)
		this.options[key] = this.options[key] || defaults[key];
};

Pizzicato.Effects.Delay.prototype = {

	applyToNode: function(node) {

		var currentNode = node;

		var dryGainNode = Pizzicato.context.createGain();
		var wetGainNode = Pizzicato.context.createGain();
		var masterGainNode = Pizzicato.context.createGain();

		// TODO: do the mix

		node.connect(dryGainNode);

		for (var i = 0; i < this.options.repetitions; i++) {

			var delayNode = Pizzicato.context.createDelay();
			delayNode.delayTime.value = this.options.time;

			var feedback = Pizzicato.context.createGain();
			feedback.gain.value = 1 - (i * (1 / (this.options.repetitions)));

			currentNode.connect(delayNode);
			delayNode.connect(feedback);
			feedback.connect(wetGainNode);

			currentNode = delayNode;
		}
		
		dryGainNode.connect(masterGainNode);
		wetGainNode.connect(masterGainNode);

		return masterGainNode;
	}

};