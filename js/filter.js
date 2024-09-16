let filterShader;

function preloadGlitchShader(){
    filterShader = loadShader('shaders/glitch.vert', 'shaders/glitch.frag');
}

let output;
let previous;

function createFramebuffers(res){
    let options = {
        width: floor(res.width),
        height: floor(res.height),
        textureFiltering: NEAREST,
    };
    output = createFramebuffer(options);
    previous = createFramebuffer(options);
}

function reset(src){
    previous.begin();
    clear();
    image(src, -previous.width/2, -previous.height/2, previous.width, previous.height);
    previous.end();
}

let glitchGeo;

function configureGLBuffers(renderer){
    const copyValueBuffer = new p5.RenderBuffer(
        1, // number of components per vertex
        'copyValue', // src
        'copyValueBuffer', // dst
        'aCopyValue', // attribute name
        renderer
    );

    renderer.retainedMode.buffers.fill.push(
        copyValueBuffer,
    );
}

function createGlitchGeo(renderer){
    if(glitchGeo){
        renderer._freeBuffers(glitchGeo.mid);
    }
    glitchGeo = new p5.Geometry();
    glitchGeo.gid = 'glitchGeometry'+Date.now().toString();
    const K = 4;
    const points = [];
    for(let i=0; i<32; i+=1){
        let x = round(random(-0.5, 1.5)*K)/K;
        let y = round(random(-0.5, 1.5)*K)/K;
        points.push(new p5.Vector(x, y, 0));
    }
    const N = points.length;
    glitchGeo.copyValue = [];
    for(let i=0; i<16; i+=1){
        const face = [];
        const copyValue = random();
        for(let k=0; k<3; k+=1){
            const idx = floor(random()*N);
            glitchGeo.vertices.push(points[idx]);
            face.push(glitchGeo.vertices.length - 1);
            glitchGeo.copyValue.push(copyValue);
        }
        glitchGeo.faces.push(face);
    }
}

function applyFilter(src){
    output.begin();


    clear();
    translate(-output.width/2, -output.height/2);

    image(src, 0, 0, output.width, output.height);

    filterShader.setUniform('uInputTex', src);
    filterShader.setUniform('uPrevTex', previous);
    shader(filterShader);
    scale(output.width, output.height);
    noStroke();
    model(glitchGeo);

    output.end();

    previous.begin();
    clear();
    translate(-previous.width/2, -previous.height/2);
    image(output, 0, 0);
    previous.end();    
}