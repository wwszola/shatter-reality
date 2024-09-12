
class Camera{
    constructor(){
        this._constraints = {
            audio: false,
            video: {
            }
        }
        this._camerasInfo = [];
        Camera.getCamerasInfo().then(info => this._camerasInfo = info);
        this._currentCameraIndex = -1;
        this._feed = null;
    }

    static async askPermissions(){
        const testConstraints = {
            'audio': false,
            'video': true
        };
        try{
            let stream = await navigator.mediaDevices.getUserMedia(testConstraints);
            stream.getTracks().forEach(track => track.stop);
            console.log('User granted access to video input');
        }catch(error){
            console.log('Cannot access video input:', error);
            throw error;
        }
    }

    static async getCamerasInfo(){
        try{
            Camera.askPermissions();
            const devicesInfo = await navigator.mediaDevices.enumerateDevices();
            const camerasInfo = devicesInfo.filter(info => info.kind === 'videoinput');
            return camerasInfo;
        }catch(error){
            console.log('Camera info unavailable', error);
            throw error;
        }
    }

    isAvailable(){
        return this._camerasInfo.length > 0;
    }

    startFeed(){
        try{
            if(this._feed !== null){
                this.stopFeed();
            }
            this._feed = createCapture(this._constraints);
            this._feed.hide();
            console.log('Feed started with constraints', this._constraints);
        }catch(error){
            console.log('Feed start failed:', error, 'with constraints:', this._constraints)
            throw error;
        }
    }

    stopFeed(){
        // mirroring p5js implementation in what property to use
        const stream = 'srcObject' in this._feed.elt ? this._feed.elt.srcObject : this._feed.elt.src;
        if(stream !== null)
            stream.getTracks().forEach(track => track.stop);
        this._feed.remove();
        this._feed = null;
    }

    isActive(){
        return this._feed !== null;
    }

    get feed(){
        return this._feed;
    }

    setAspectRatio(ratio){
        this._constraints.video['aspectRatio'] = {ideal: ratio};
    }

    nextCamera(){
        if(!this.isAvailable()){
            throw new Error('Camera is not available');
        }
        this._currentCameraIndex += 1;
        this._currentCameraIndex %= this._camerasInfo.length;
        const deviceId = this._camerasInfo[this._currentCameraIndex].deviceId;
        this._constraints.video['deviceId'] = {exact: deviceId};
    }

}