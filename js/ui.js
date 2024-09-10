
const camSwitchBtn = document.getElementById('cam-switch');
const RecordBtn = document.getElementById('record');

document.addEventListener('DOMContentLoaded', () => {
    camSwitchBtn.addEventListener('click', changeCamera);
    RecordBtn.addEventListener('touchstart', startRecording);
    RecordBtn.addEventListener('touchend', () => {
        stopRecording();
        setTimeout(postConvertMessage, 1000);
    });
});
