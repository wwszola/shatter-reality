importScripts('../libraries/ffmpeg-all-codecs.js');

function log(content){
    postMessage({
        type : 'stdout',
        data : content
    });
}

onmessage = function(event) {
    const message = event.data;

    if(message.type === "command") {
        const module = {
            print: log,
            printErr: log,
            files: message.files || [],
            arguments: message.arguments || [],
            TOTAL_MEMORY: message.TOTAL_MEMORY || false
        }

        postMessage({
            type: 'start',
            data: module.arguments.join(" ")
        });

        const t1 = Date.now();
        const result = ffmpeg_run(module);
        const t = Date.now() - t1;

        log('Finished processing (took ' + t.toString() + ' ms)');

        postMessage({
            type: 'done',
            data: result,
            time: t
        });
    }
};

postMessage({
    type: 'ready'
});