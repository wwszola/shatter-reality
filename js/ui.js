
const camSwitchBtn = document.getElementById('cam-switch');
const RecordBtn = document.getElementById('record');

const debugBtn = document.getElementById('debug-toggle');
const debugP = document.getElementById('debug-content');

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
        console.log('recorder blobs:', recorder._videoBlobs);
    });

    if(!isMobileDevice()){
        debugBtn.style.visibility = 'hidden';
    }
    debugBtn.addEventListener('click', () => {
        if(debugP.style.visibility === 'hidden')
            debugP.style.visibility = 'visible';
        else
            debugP.style.visibility = 'hidden';
    });
});
