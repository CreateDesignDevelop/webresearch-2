window.onload = function(){
  var canvas = document.getElementById('canvas');
	var c = canvas.getContext('2d');
  var frequencyData;
	var dragging = false;
	var lastX;
	var marginLeft = 0;
  var audioInitialized = false;
  var isPlaying = false;
	// c.scale(2, 2); // Doubles size of anything drawn to canvas.

  // DRAG CANVAS
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

  // CANVAS STYLE
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);

  // AUDIO UPLOAD
  $('#fileUpload').click(function(){
    audioInit();
  });

  // AUDIO INIT
  // The createAnalyser() method of the AudioContext interface creates an AnalyserNode, which can be used to expose audio time and frequency data and create data visualisations.
  // The following example shows basic usage of an AudioContext to create an Analyser node, then use requestAnimationFrame() to collect time domain data repeatedly and draw an "oscilloscope style" output of the current audio input
  function audioInit(){
    console.log('audioInit');
    audioContext = new AudioContext();              // Used to play the audio
    analyser = audioContext.createAnalyser();       // The createAnalyser() method of the AudioContext interface creates an AnalyserNode, which can be used to expose audio time and frequency data and create data visualisations.
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;

    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    function getFrequency() {
      analyser.getByteFrequencyData(frequencyData);
      // console.log(frequencyData[8]);
      requestAnimationFrame(getFrequency);
      if (isPlaying) {
        renderFrame();
      }
    }
    getFrequency();
  }

	var posX = 0;
	function renderFrame(){
		if (posX < canvas.width){
			posX = posX + .3;
			var colorsDown = ['white', 'yellow', 'blue', 'red', 'gray', 'green', 'brown', 'orange'];
			var colorsUp = ['Aqua', 'Chartreuse', 'DarkSalmon', 'DeepPink', 'Gold', 'GreenYellow', 'LightCoral'];
			var colorsAll = ['white', 'yellow', 'Aqua', 'red', 'gray', 'green', 'brown', 'orange', 'blue', 'Chartreuse', 'DarkSalmon', 'DeepPink', 'Gold', 'GreenYellow', 'black'];

      multiplyer = 1;
      for (var i = 0; i <= colorsUp.length; i++) {
        c.fillStyle = colorsUp[i];
				c.beginPath();
				c.arc(posX, -frequencyData[i] * multiplyer + 500, .5, 0, Math.PI * 2, false);
				c.fill();
			}
      for (var i = 0; i <= colorsDown.length; i++) {
        c.fillStyle = colorsDown[i];
        c.beginPath();
        c.arc(posX, +frequencyData[i] * multiplyer + 000, .5, 0, Math.PI * 2, false);
        c.fill();
      }
      $('#frequencyData').text(frequencyData);
		}
	}

  // AUDIO CONTROLS
  $('#vol-control').change(function(){
    setVolume(this.value);
  });
  function setVolume(val){
    var player = document.querySelector('audio');
    console.log('Before: ' + player.volume);
    player.volume = val / 100;
    console.log('After: ' + player.volume);
  }
  $('#play').click(function(){
    if (!audioInitialized) {
      audioInit();
      audioInitialized = true;
    }
    isPlaying = true;
    audio.play();
  });
  $('#pause').click(function(){
    isPlaying = false;
    audio.pause();
  });

  // IMAGE CAPTURE
  $('#capture').click(function(){
    html2canvas($('#canvasdiv'),{
      onrendered: function(canvas){
        // canvas is the final rendered <canvas> element
        var myImage = canvas.toDataURL('image/png');
        window.open(myImage);
        // $('#dialogDiv').html('<img src="' + myImage + '" alt="">');
        // $('#dialogDiv').dialog();
      }
    });
  });
};
