let canvas;

let camera;
let recorder;
let converter;
let preview;
let filter;

function preload(){
    GlitchFilter.preloadShaders();
}

function setup(){
    const canvasSize = {
        width: windowWidth,
        height: windowHeight
    }
    if(!isMobileDevice()){
        canvasSize.width = 720;
        canvasSize.height = 720;
    }
    const canvasElt = document.querySelector('.app-container canvas');

    canvas = createCanvas(canvasSize.width, canvasSize.height, WEBGL, canvasElt);
    pixelDensity(1);

    camera = new Camera();
    camera.setResolution(width, height);
    camera.initCameraInfo().then(() => {
        camera.nextCamera();
        camera.startFeed();
    });

    recorder = new CanvasRecorder(canvasElt);
    if(recorder.getPrefferedMimeType() === webmType){
        converter = new FFmpegConverter();
    }

    preview = new Preview();

    filter = new GlitchFilter(canvas);
}

function draw(){
    translate(-width/2, -height/2);
    background('yellow');

    if(preview.isActive()){
        const src = preview.getImage();
        image(src, 0, 0, width, height);
    }else if(camera.isActive()){
        const result = filter.apply(camera.feed);

        image(result, 0, 0, width, height);
    }

    frameRate(30);
}
