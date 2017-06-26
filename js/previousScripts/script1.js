var input;
var analyzer;
function preload() {
  song = loadSound('sound.mp3');
}
function setup() {
  createCanvas(710, 200);
  background(255);
  // Create an Audio input
  input = new p5.AudioIn();
  input.start();
  fft = new p5.FFT();
  song.setVolume(0.1);
  song.play();
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  // analyzer.setInput(song);
}
// function draw(){
  // background(0);
  // var spectrum = fft.analyze();
  // noStroke();
  // fill(0,255,0); // spectrum is green
  // for (var i = 0; i< spectrum.length; i++){
  //   var x = map(i, 0, spectrum.length, 0, width);
  //   var h = -height + map(spectrum[i], 0, 250, height, 0);
  //   // rect(x, height, width / spectrum.length, h )
  //   rect(x, height, 1, h )
  // }

  // var waveform = fft.waveform();
  // noFill();
  // beginShape();
  // stroke(255,0,0); // waveform is red
  // strokeWeight(1);
  // for (var i = 0; i< waveform.length; i++){
  //   var x = map(i, 0, waveform.length, 0, width);
  //   var y = map( waveform[i], -1, 1, 0, height);
  //   vertex(x,y);
  // }
  // endShape();

  // // change oscillator frequency based on mouseX
  // var freq = map(mouseX, 0, width, 40, 880);
  // osc.freq(freq);
  //
  // var amp = map(mouseY, 0, height, 1, .01);
  // osc.amp(amp);
// }

// function draw(){
//   fill(0, 12);
//   rect(0, 0, width, height);
//   fill(255);
//   noStroke();
//   ellipse(mouseX, mouseY, 60, 60);
// }

// function draw() {
//   background(255);

//   // Get the average (root mean square) amplitude
//   var rms = analyzer.getLevel();
//   fill(127);
//   stroke(0);

//   // Draw an ellipse with size based on volume
//   ellipse(width/2, height/2, 10+rms*200, 10+rms*200);
// }

function draw() {
  // Get the overall volume (between 0 and 1.0)
  var volume = input.getLevel();

  // If the volume > 0.1,  a rect is drawn at a random location.
  // The louder the volume, the larger the rectangle.
  var threshold = 0.1;
  if (volume > threshold) {
    stroke(0);
    fill(0, 100);
    rect(random(40, width), random(height), volume*50, volume*50);
  }

  // Graph the overall potential volume, w/ a line at the threshold
  var y = map(volume, 0, 1, height, 0);
  var ythreshold = map(threshold, 0, 1, height, 0);

  noStroke();
  fill(175);
  rect(0, 0, 20, height);
  // Then draw a rectangle on the graph, sized according to volume
  fill(0);
  rect(0, y, 20, y);
  stroke(0);
  line(0, ythreshold, 19, ythreshold);
}
