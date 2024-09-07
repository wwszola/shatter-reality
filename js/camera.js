
// asks user for permission and lists the available video inputs
async function getCamerasInfo(){
    const testConstraints = {
        'audio': false,
        'video': true
    };
    try{
        let stream = await navigator.mediaDevices.getUserMedia(testConstraints);
        console.log('User granted access to video input');
        stopStream(stream);
        const devicesInfo = await navigator.mediaDevices.enumerateDevices();
        const camerasInfo = devicesInfo.filter(info => info.kind === 'videoinput');
        return camerasInfo;
    }catch(error){
        console.log('Cannot access video input:', error);
        return [];
    }
}

function stopStream(stream){
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}
