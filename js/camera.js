
class Camera{
    constructor(){
        this._constraints = {
            audio: false,
            video: {
            }
        }
        this._camerasInfo = [];
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
            stream.getTracks().forEach(track => track.stop());
            console.log('User granted access to video input');
        }catch(error){
            console.log('Cannot access video input:', error.message);
            throw error;
        }
    }

    static async getCamerasInfo(){
        try{
            await Camera.askPermissions();
            const devicesInfo = await navigator.mediaDevices.enumerateDevices();
            const camerasInfo = devicesInfo.filter(info => info.kind === 'videoinput');
            return camerasInfo;
        }catch(error){
            console.log('Camera info unavailable', error.message);
            throw error;
        }
    }

    async initCameraInfo(){
        try{
            const info = await Camera.getCamerasInfo();
            this._camerasInfo = info;
        }catch(error){
            console.log('Cannot initialize camera', error.message);
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
            const feed = createCapture(this._constraints, (stream) => {
                this._feed = feed;
                this._feed.hide();
                console.log('Feed started with constraints', this._constraints, 'using stream', stream);
            });
        }catch(error){
            console.log('Feed start failed:', error.message, 'with constraints:', this._constraints)
            throw error;
        }
    }

    stopFeed(){
        // mirroring p5js implementation in what property to use
        const stream = 'srcObject' in this._feed.elt ? this._feed.elt.srcObject : this._feed.elt.src;
        if(stream !== null)
            stream.getTracks().forEach(track => track.stop());
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

    setResolution(w, h){
        const aspectRatio = w/h;
        this._constraints.video['aspectRatio'] = {ideal: aspectRatio};
        if(window.matchMedia('(orientation:portrait)').matches){
            [w, h] = [h, w];    
        }
        this._constraints.video['width'] = {ideal: w};
        this._constraints.video['height'] = {ideal: h};
    }

    getActiveResolution(){
        return {width: this._feed.width, height: this._feed.height};
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