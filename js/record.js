
const mp4Type = 'video/mp4;codecs=h264';
const webmType = 'video/x-matroska;codecs=h264';

class CanvasRecorder{
    constructor(canvasElement){
        this._canvasElement = canvasElement;
        this._lastBlob = null;
        this._recorder = null;
        this._recorderOptions = {
            // videoBitsPerSecond: 1e6
        }
        this._recorderOptions['mimeType'] = this.getPrefferedMimeType();
    }

    getPrefferedMimeType(){
        if(this._recorderOptions.hasOwnProperty('mimeType')){
            return this._recorderOptions['mimeType'];
        }
        if(MediaRecorder.isTypeSupported(mp4Type)){
            return mp4Type;
        }else if(MediaRecorder.isTypeSupported(webmType)){
            return webmType;
        }else{
            throw new Error('No suitable video mime type is supported');
        }
    }

    startRecording(){
        const stream = this._canvasElement.captureStream(30);
        const chunks = [];
        const type = this.getPrefferedMimeType();
        this._recorder = new MediaRecorder(stream, this._recorderOptions);
        this._recorder.ondataavailable = event => chunks.push(event.data);
        this._recorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
            if(chunks.length == 0){
                this._recorder = null;
                throw new Error('No chunks recorded');
            }
            const videoBlob = new Blob(chunks, {type: chunks[0].type});
            if(videoBlob.size == 0){
                throw new Error('Recorder video blob is size zero');
            }
            this._lastBlob = videoBlob;
        };

        this._recorder.start();
        console.log('Recorder started with options', this._recorderOptions);
    }

    stopRecording(){
        this._recorder.stop();
    }
}

function blobToUint8Array(blob){
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

class FFmpegConverter{
    constructor(){
        this._worker = null;
        this._isWorkerLoaded = false;
        this._onCommandSuccess = undefined;
        this._workerInProgress = false;
        this._initWorker();
    }

    _initWorker(){
        this._worker = new Worker('js/ffmpeg-worker.js');
        this._worker.onmessage = event => {
            const message = event.data;
            if(message.type === 'stdout'){
                console.log('FFmpeg worker stdout:', message.data);
            }else if(message.type === 'loaded'){
                console.log('FFmpeg worker loaded properly');
                this._isWorkerLoaded = true;
            }else if(message.type === 'start'){
                console.log('FFmpeg worker has received command:', message.data);
                this._workerInProgress = true;
            }else if(message.type === 'done'){
                console.log('FFmpeg worker finished executing');
                this._onCommandSuccess(message.data[0].data);
                this._onCommandSuccess = undefined;
                this._workerInProgress = false;
            }
        }
        this._worker.onerror = error => {
            throw new Error('FFmpeg error: ' + error.message);
        }
    }

    isReady(){
        return this._isWorkerLoaded && !this._workerInProgress;
    }

    // call isReady method before calling this to be sure
    async convertWebmToMp4(webmBlob, success){
        if(webmBlob.size == 0){
            throw new Error('Invalid webmBlob with size 0');
        }
        let videoArray = null;
        try{
            videoArray = await blobToUint8Array(webmBlob);
            console.log('video array', videoArray);
        }catch(error){
            throw error;
        }
        this._onCommandSuccess = success;
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
        this._worker.postMessage(convertMessage);
    }
}

function downloadBlob(blob, filename){
    let videoUrl = URL.createObjectURL(blob);
    let anchor = document.createElement('a');
    anchor.href = videoUrl;
    anchor.download = filename;
    anchor.click();

    setTimeout(() => {
        URL.revokeObjectURL(videoUrl);
    }, 0);
}