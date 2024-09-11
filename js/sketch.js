const canvasElt = document.getElementById('canvas0');
let canvas;

const camera = new Camera();

function setup(){
    initWorker();

    canvas = createCanvas(windowWidth, windowHeight, WEBGL, canvasElt);
    pixelDensity(1);

    camera.setAspectRatio(height/width);
    camera.startFeed();
}

function draw(){
    translate(-width/2, -height/2);
    background('yellow');

    if(camera.isActive()){
        image(camera.feed, 0, 0, width, height);
    }
    frameRate(30);
}
