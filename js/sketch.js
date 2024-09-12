const canvasElt = document.getElementById('canvas0');
let canvas;

let camera;
let recorder;
let converter;

function setup(){
    canvas = createCanvas(windowWidth, windowHeight, WEBGL, canvasElt);
    pixelDensity(1);

    camera = new Camera();
    camera.setAspectRatio(height/width);
    camera.startFeed();

    recorder = new CanvasRecorder(canvasElt);
    converter = new FFmpegConverter();
}

function draw(){
    translate(-width/2, -height/2);
    background('yellow');

    if(camera.isActive()){
        image(camera.feed, 0, 0, width, height);
    }
    frameRate(30);
}
