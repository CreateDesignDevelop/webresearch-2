window.onload = function(){
	var canvas = document.getElementById('canvas');
	var c = canvas.getContext('2d');
	var dragging = false;
	var lastX;
	var marginLeft = 0;
	// c.scale(2, 2) // Doubles size of anything draw to canvas.

	canvas.addEventListener('mousedown', function(e) {
    var evt = e || event;
    dragging = true;
    lastX = evt.clientX;
    e.preventDefault();
	}, false);

	window.addEventListener('mousemove', function(e) {
	    var evt = e || event;
	    if (dragging) {
	        var delta = evt.clientX - lastX;
	        lastX = evt.clientX;
	        marginLeft += delta;
	        canvas.style.marginLeft = marginLeft + "px";
	    }
	    e.preventDefault();
	}, false);

	window.addEventListener('mouseup', function() {
	    dragging = false;
	}, false);

	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);

	audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 32;

  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  function getFrequency() {
    analyser.getByteFrequencyData(frequencyData);
    // console.log(frequencyData[8]);
    requestAnimationFrame(getFrequency);
    renderFrame();
  }

	var posX = 0;
	function renderFrame(){
		if (posX < canvas.width){
			posX = posX + .3;
			var colorsDown = ['white', 'yellow', 'blue', 'red', 'gray', 'green', 'brown', 'orange'];
			var colorsUp = ['Aqua', 'Chartreuse', 'DarkSalmon', 'DeepPink', 'Gold', 'GreenYellow', 'LightCoral'];

			for (var i = 0; i <= colorsDown.length; i++) {
				c.fillStyle = colorsDown[i];
				c.beginPath();
				c.arc(posX, frequencyData[i]/5 + 250, .5, 0, Math.PI * 2, false);
				c.fill();
			}
			for (var i = 0; i <= colorsUp.length; i++) {
				c.fillStyle = colorsUp[i];
				c.beginPath();
				c.arc(posX, -frequencyData[i]/5 + 250, .5, 0, Math.PI * 2, false);
				c.fill();
			}
		}
	}

	audio.pause();
  audio.play();
  getFrequency();
};
