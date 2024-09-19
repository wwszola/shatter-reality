
class GlitchFilter{
    static _glitchShader;
    
    static preloadShaders(){
        GlitchFilter._glitchShader = loadShader('shaders/glitch.vert', 'shaders/glitch.frag');
    }

    constructor(renderer){
        this._renderer = renderer;

        this._res = {
            width: this._renderer.width,
            height: this._renderer.height,
        }
        const options = {
            width: this._res.width,
            height: this._res.height,
            textureFiltering: NEAREST,
        };
        this._output = createFramebuffer(options);
        this._previous = createFramebuffer(options);

        this._shaderProg = GlitchFilter._glitchShader;

        this._geometry = null;

        this._configureGLBuffers();
    }

    reset(src){
        this._previous.begin();
        clear();
        image(
            src, 
            -this._res.width/2, -this._res.height/2, 
            this._res.width, this._res.height
        );
        this._previous.end();
    }

    _configureGLBuffers(){
        const copyValueBuffer = new p5.RenderBuffer(
            1, // number of components per vertex
            'copyValue', // src
            'copyValueBuffer', // dst
            'aCopyValue', // attribute name
            this._renderer
        );
    
        this._renderer.retainedMode.buffers.fill.push(
            copyValueBuffer,
        );
    }

    createGeometry(){
        if(this._geometry){
            this._renderer._freeBuffers(this._geometry.mid);
        }
        this._geometry = new p5.Geometry();
        this._geometry.gid = 'glitchGeometry'+Date.now().toString();
        const K = 8;
        const points = [];
        for(let i=0; i<64; i+=1){
            let x = round(random(-0.5, 1.5)*K)/K;
            let y = round(random(-0.5, 1.5)*K)/K;
            points.push(new p5.Vector(x, y, 0));
        }
        const N = points.length;
        this._geometry.copyValue = [];
        for(let i=0; i<64; i+=1){
            const face = [];
            const copyValue = random();
            for(let k=0; k<3; k+=1){
                const idx = floor(random()*N);
                this._geometry.vertices.push(points[idx]);
                face.push(this._geometry.vertices.length - 1);
                this._geometry.copyValue.push(copyValue);
            }
            this._geometry.faces.push(face);
        }
    }

    apply(src){
        this._output.begin();
        clear();
        translate(-this._res.width/2, -this._res.height/2);

        image(src, 0, 0, this._res.width, this._res.height);
    
        this._shaderProg.setUniform('uInputTex', src);
        this._shaderProg.setUniform('uPrevTex', this._previous);
        shader(this._shaderProg);
        scale(this._res.width, this._res.height);
        noStroke();
        model(this._geometry);
    
        this._output.end();
    
        // copy output to previous
        this._previous.begin();
        clear();
        translate(-this._res.width/2, -this._res.height/2);
        image(this._output, 0, 0, this._res.width, this._res.height);
        this._previous.end();
        
        return this._output;
    }
}