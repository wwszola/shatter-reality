function isMobileDevice(){
    const isTouchDevice = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
    return isTouchDevice;
}

function extendDebugLog(message){
    debugP.innerHTML += '>> ';
    debugP.innerHTML += message;
    debugP.innerHTML += '<br>';
}

if(isMobileDevice){
    (function(){
        const originalLog = console.log;
        console.log = (...data) => {
            extendDebugLog(JSON.stringify(data));
            originalLog.apply(console, data);
        };
    })();

    window.addEventListener('error', error => {
        const message = error.message.toString();
        extendDebugLog(message);
        return false;   
    });
    
    window.addEventListener('unhandledrejection', event => {
        const message = event.reason.toString();
        extendDebugLog(message);
    });
}

