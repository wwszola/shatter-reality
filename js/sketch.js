const canvasElt = document.getElementById('canvas0');
let canvas;

let camera;
let recorder;
let converter;
let preview;

function preload(){
    preloadGlitchShader();
}

function setup(){
    canvas = createCanvas(windowWidth, windowHeight, WEBGL, canvasElt);
    pixelDensity(1);

    camera = new Camera();
    camera.setAspectRatio(height/width);

    recorder = new CanvasRecorder(canvasElt);
    if(recorder.getPrefferedMimeType() === webmType){
        converter = new FFmpegConverter();
    }

    preview = new Preview();

    const pixelateFactor = 8;
    const filterRes = {width: width/pixelateFactor, height: height/pixelateFactor};
    createFramebuffers(filterRes);
    configureGLBuffers(canvas);
    createGlitchGeo(canvas);

    camera.startFeed();
}

function draw(){
    translate(-width/2, -height/2);
    background('yellow');

    if(preview.isActive()){
        image(preview.getImage(), 0, 0, width, height);
    }else{
        if(random() < 0.1){
            canvas._freeBuffers(glitchGeo.mid);
            createGlitchGeo(canvas);
        }
        applyFilter(camera.feed);

        image(output, 0, 0, width, height);
    }

    frameRate(30);
}
