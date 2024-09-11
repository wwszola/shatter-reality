function isMobileDevice(){
    const isTouchDevice = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
    return isTouchDevice;
}

function debugLog(...args){
    const debugP = document.getElementById('debug-content');

    console.log(...args);
    if(isMobileDevice()){
        debugP.innerHTML += '>> ';
        debugP.innerHTML += JSON.stringify([...args]);
        debugP.innerHTML += '<br>';
    }
}