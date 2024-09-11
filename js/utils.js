function isMobileDevice(){
    const isTouchDevice = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
    return isTouchDevice;
}

function debugLog(...args){
    console.log(...args);
    if(isMobileDevice()){
        debugP.innerText += JSON.stringify([...args]) + '\n';
    }
}