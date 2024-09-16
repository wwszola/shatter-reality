class Preview{
    constructor(){
        this._videoUrl = null;
        this._video = null;
    }

    isActive(){
        return this._video !== null && this._videoUrl !== null;
    }

    playBlob(blob){
        stop();
        this._videoUrl = URL.createObjectURL(blob);
        this._video = createVideo(this._videoUrl);
        this._video.hide();
        this._video.loop();
    }

    stop(){
        if(this._videoUrl !== null){
            URL.revokeObjectURL(this._videoUrl);
            this._videoUrl = null;
        }
        if(this._video !== null){
            this._video.remove();
            this._video = null;
        }
    }

    getImage(){
        return this._video;
    }

}