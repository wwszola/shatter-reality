

const cameraToolsDiv = document.getElementById('camera-tools');
const camSwitchButton = document.getElementById('cam-switch-button');
const recordButton = document.getElementById('record-button');


const previewToolsDiv = document.getElementById('preview-tools');
const downloadButton = document.getElementById('download-button');
const exitPreviewButton = document.getElementById('exit-preview-button');

const filterParamsDiv = document.getElementById('filter-params');

function addRangeParam(name, min, max, step, _default){
    const container = document.createElement('div');
    container.className = 'param-container';
    container.id = name + '-param-container';

    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step;
    input.defaultValue = _default;
    input.className = 'param-tool';
    input.id = name + '-param-range';

    input.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        const changes = {};
        changes[name] = value;
        filter.setParams(changes);
    });

    container.appendChild(input);
    filterParamsDiv.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
    cameraToolsDiv.style.visibility = 'visible';
    previewToolsDiv.style.visibility = 'hidden';

    camSwitchButton.addEventListener('click', () => {
        camera.nextCamera();
        camera.startFeed();
    });
    
    recordButton.addEventListener('click', () => {
        if(recorder.isRecording()){
            recorder.stopRecording((videoBlob) => {
                preview.playBlob(videoBlob);
                cameraToolsDiv.style.visibility = 'hidden';
                previewToolsDiv.style.visibility = 'visible';
                filterParamsDiv.style.visibility = 'hidden';
            });
            recordButton.style.backgroundColor = '';
        }else{
            recorder.startRecording();
            recordButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        }
    });

    exitPreviewButton.addEventListener('click', () => {
        preview.stop();
        cameraToolsDiv.style.visibility = 'visible';
        previewToolsDiv.style.visibility = 'hidden';
        filterParamsDiv.style.visibility = 'visible';
    });

    downloadButton.addEventListener('click', () => {
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

    addRangeParam('pixelateFactor', 1, 16, 1, 4);
    addRangeParam('resetGeometryRate', 0.0, 1.0, 0.1, 0.5);
    addRangeParam('transformPower', 0.0, 0.3, 0.05, 0.1);
    addRangeParam('copyValueThreshold', 0.0, 1.0, 0.1, 0.3);
    addRangeParam('maxTriangleSize', 0.0, 2.0, 0.1, 1.0);
});
