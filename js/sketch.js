const canvasElt = document.getElementById('canvas0');
let canvas;

let camerasInfo = [];
let cameraIndex = -1;
let cameraFeed = null;

function changeCamera(){
    if(camerasInfo.length > 0){
        cameraIndex = (cameraIndex + 1)%camerasInfo.length;
        startCapture(camerasInfo[cameraIndex].deviceId);
    }
}

function startCapture(deviceId){
    if(cameraFeed !== null){
        // mirroring p5js implementation in what property to use
        let stream = 'srcObject' in cameraFeed.elt ? cameraFeed.elt.srcObject : cameraFeed.elt.src;

        if(stream !== null)
            stopStream(stream);

        cameraFeed.remove();
        cameraFeed = null;
    }
    const constraints = {
        audio: false,
        video: {
            deviceId: {exact: deviceId}
        }
    };
    cameraFeed = createCapture(constraints);
    cameraFeed.hide();
}

function setup(){
    initWorker();

    canvas = createCanvas(windowWidth, windowHeight, WEBGL, canvasElt);
    pixelDensity(1);

    getCamerasInfo().then(info => {
        camerasInfo = info;
        changeCamera();
    });
}

function draw(){
    translate(-width/2, -height/2);
    background('yellow');

    if(cameraFeed !== null){
        image(cameraFeed, 0, 0, width, height);
    }
    frameRate(30);
}
