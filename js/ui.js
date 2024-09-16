

const toolsDiv = document.getElementById('tools');
const camSwitchBtn = document.getElementById('cam-switch');
const RecordBtn = document.getElementById('record');

const debugBtn = document.getElementById('debug-toggle');
const debugP = document.getElementById('debug-content');

const previewDiv = document.getElementById('preview');
const downloadBtn = document.getElementById('download');
const exitBtn = document.getElementById('exit');

document.addEventListener('DOMContentLoaded', () => {
    camSwitchBtn.addEventListener('click', () => {
        camera.nextCamera();
        camera.startFeed();
    });
    RecordBtn.addEventListener('touchstart', () => {
        recorder.startRecording();
    });
    RecordBtn.addEventListener('touchend', () => {
        recorder.stopRecording();
        setTimeout(()=>{
            preview.playBlob(recorder._lastBlob);
            toolsDiv.style.visibility = 'hidden';
            previewDiv.style.visibility = 'visible';
        }, 2500);
    });

    downloadBtn.addEventListener('click', () => {
        if(recorder.getPrefferedMimeType() === webmType){
            if(converter.isReady()){
                converter.convertWebmToMp4(recorder._lastBlob, (data) => {
                    const blob = new Blob([data], {type: mp4Type});
                    downloadBlob(blob, 'video.mp4');
                });
            }else{
                throw new Error('Converter is not ready');
            }
        }else{
            downloadBlob(recorder._lastBlob, 'video.mp4');
        }
    });

    exitBtn.addEventListener('click', () => {
        preview.stop();
        toolsDiv.style.visibility = 'visible';
        previewDiv.style.visibility = 'hidden';
    });

    if(!isMobileDevice() || !DEBUG){
        debugBtn.style.visibility = 'hidden';
    }
    debugBtn.addEventListener('click', () => {
        if(debugP.style.visibility === 'hidden')
            debugP.style.visibility = 'visible';
        else
            debugP.style.visibility = 'hidden';
    });
});
