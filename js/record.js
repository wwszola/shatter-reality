
let recorder = null;
let webmBlob = null;

function startRecording(){
    webmBlob = null;
    let canvasStream = canvasElt.captureStream(30);
    let chunks = [];
    
    let options = {
        videoBitsPerSecond: 1e5,
        mimeType: 'video/webm; codecs=h264'
    };
    recorder = new MediaRecorder(canvasStream, options);

    recorder.ondataavailable = event => chunks.push(event.data);
    recorder.onstop = () => {
        canvasStream.getTracks().forEach(track => track.stop);
        webmBlob = new Blob(chunks, {type: 'video/webm'});
        recorder = null;
    };

    recorder.start();
    debugLog('Recorder started with options', options);
}

function stopRecording(){
    recorder.stop();
}

function blobToUint8Array(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = event => {
            const arrayBuffer = event.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            resolve(uint8Array);
        };
        reader.onerror = event => {
            reject(new Error("Failed to read the blob as ArrayBuffer: " + event.target.error));
        };
        
        reader.readAsArrayBuffer(blob);
    });
}
let worker = null;
let isWorkerReady = false;
let mp4Blob = null;

function initWorker(){
    if(worker !== null){
        worker.terminate();
        worker = null;
        isWorkerReady = false;
    }
    worker = new Worker("js/worker-record.js");
    worker.onmessage = event => {
        const message = event.data;
        if(message.type === 'stdout'){
            debugLog('Worker stdout:', message.data);
        }else if(message.type === 'ready'){
            debugLog('Worker ready');
            isWorkerReady = true;
        }else if(message.type === 'start'){
            debugLog('Worker has received command', message.data);
            mp4Blob = null;
        }else if(message.type === 'done'){
            debugLog('Worker finished executing');
            mp4Blob = new Blob([message.data[0].data], {type: 'video/mp4'});
            downloadMp4();
        }else{
            debugLog('Unhandled worker message:', message);
        }
    };
    worker.onerror = error => {
        debugLog('Worker error:', error);
    };
}

async function postConvertMessage(){
    if(webmBlob === null){
        debugLog('postConvertMessage: webmBlob is null');
        return;
    }
    const videoArray = await blobToUint8Array(webmBlob);
    const convertMessage = {
        type: 'command',
        arguments: [
            '-i', 'video.webm',
            '-c', 'copy',
            'video.mp4'
        ],
        files: [
            {data: videoArray, name: 'video.webm'}
        ]
    };
    worker.postMessage(convertMessage);
}

function downloadBlob(blob){
    let videoUrl = URL.createObjectURL(blob);

    let filename = 'invalid';
    if(blob.type === 'video/webm') filename = 'video.webm';
    else if(blob.type === 'video/mp4') filename = 'video.mp4';

    let anchor = document.createElement('a');
    anchor.href = videoUrl;
    anchor.download = filename;
    anchor.click();

    setTimeout(() => {
        URL.revokeObjectURL(videoUrl);
    }, 0);
}

function downloadMp4(){
    downloadBlob(mp4Blob);
}