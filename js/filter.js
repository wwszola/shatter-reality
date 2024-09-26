
class GlitchFilter{
    static _glitchShader;
    
    static preloadShaders(){
        GlitchFilter._glitchShader = loadShader('shaders/glitch.vert', 'shaders/glitch.frag');
    }

    constructor(renderer, params = {}){
        this._params = {
            pixelateFactor: 8,
            resetGeometryRate: 0.5,
        };
        this.setParams(params);

        this._renderer = renderer;

        this._res = this.getComputedRes();
        const options = {
            width: this._res.width,
            height: this._res.height,
            textureFiltering: NEAREST,
        };
        this._output = createFramebuffer(options);
        this._previous = createFramebuffer(options);

        this._shaderProg = GlitchFilter._glitchShader;

        this._triangles = new Triangles(this._renderer, 12, 'triangles');
    }

    resize(w, h){
        this._output.resize(w, h);
        this._previous.resize(w, h);
        this._res.width = w;
        this._res.height = h;
    }

    getComputedRes(){
        return {
            width: floor(this._renderer.width/this._params.pixelateFactor),
            height: floor(this._renderer.height/this._params.pixelateFactor)
        };
    }

    _resizeIfNeeded(){
        if(this._previous === undefined || this._output === undefined){
            return;
        }
        const computedRes = this.getComputedRes();
        if(computedRes.width != this._res.width || computedRes.height != this._res.height){
            this.resize(computedRes.width, computedRes.height);
        }
    }

    setParams(changes){
        for(const key in changes){
            if(this._params.hasOwnProperty(key)){
                this._params[key] = changes[key];
                if(key === 'pixelateFactor'){
                    this._resizeIfNeeded();
                }
            }
        }
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

    _render(src){
        this._output.begin();
        clear();
        translate(-this._res.width/2, -this._res.height/2);

        image(src, 0, 0, this._res.width, this._res.height);
        
        this._shaderProg.setUniform('uInputTex', src);
        this._shaderProg.setUniform('uPrevTex', this._previous);
        shader(this._shaderProg);
        scale(this._res.width, this._res.height);
        noStroke();
        model(this._triangles.getGeometry());
    
        this._output.end();
    
        // copy output to previous
        this._previous.begin();
        clear();
        translate(-this._res.width/2, -this._res.height/2);
        image(this._output, 0, 0, this._res.width, this._res.height);
        this._previous.end();
        
        return this._output;
    }

    apply(src){
        if(random() < this._params.resetGeometryRate){
            const newTriangle = randomTriangle();
            const idx = this._triangles.pushTriangle(newTriangle);
            this._triangles.setCopyValue(idx, random());
            this._triangles.setTranslate(idx, [random(-0.1, 0.1), random(-0.1, 0.1)]);
            this._triangles.reattach();
        }

        return this._render(src);
    }

}

function randomTriangle(){
    const center = p5.Vector.random2D();
    const points = [];
    for(let i=0; i<3; i+=1){
        const angle = random(TWO_PI*(i)/3.0, TWO_PI*(i+1)/3.0);
        const mag = random(0.25, 1.0);
        const x = mag*cos(angle) + center.x;
        const y = mag*sin(angle) + center.y;
        points.push(new p5.Vector(x, y, 0.0));
    }
    return points;
}

class Triangles{
    constructor(renderer, maxFaces, name){
        this._renderer = renderer;
        this._maxFaces = maxFaces;
        this._pushIdx = 0;
        this._geometry = null;
        this._name = name;
        this._gidCounter = -1;

        this._configureGLBuffers();
        this.initGeometry();
    }

    _configureGLBuffers(){
        const copyValueBuffer = new p5.RenderBuffer(
            1, // number of components per vertex
            'copyValue', // src
            'copyValueBuffer', // dst
            'aCopyValue', // attribute name
            this._renderer
        );
        const translateBuffer = new p5.RenderBuffer(
            2, // number of components per vertex
            'translate', // src
            'translateBuffer', // dst
            'aTranslate', // attribute name
            this._renderer
        );
    
        this._renderer.retainedMode.buffers.fill.push(
            copyValueBuffer,
            translateBuffer,
        );
    }

    _genGid(){
        this._idCounter += 1;
        return this._name+str(this._gidCounter);
    }

    initGeometry(){
        if(this._geometry){
            this._renderer.freeGeometry(this._geometry);
        }
        this._geometry = new p5.Geometry();
        this._geometry.gid = this._genGid();
        this._geometry.copyValue = [];
        this._geometry.translate = [];
    }

    getGeometry(){
        return this._geometry;
    }

    reattach(){
        this._renderer.freeGeometry(this._geometry);
        this._geometry.gid = this._genGid();
    }

    pushTriangle(points){
        if(this._pushIdx < this._geometry.faces.length){
            for(let i=0; i<3; i+=1){
                this._geometry.vertices[this._pushIdx*3 + i] = points[i];
            }
        }else{
            const nVert = this._geometry.vertices.length;
            this._geometry.vertices.push(...points);
            this._geometry.faces.push([nVert, nVert+1, nVert+2]);
        }
        const oldIdx = this._pushIdx;
        this._pushIdx = (this._pushIdx + 1)%this._maxFaces;
        return oldIdx;
    }

    setCopyValue(faceIdx, value){
        for(let i=0; i<3; i+=1){
            this._geometry.copyValue[faceIdx*3 + i] = value;
        }
    }

    setTranslate(faceIdx, values){
        for(let i=0; i<3; i+=1){
            this._geometry.translate[(faceIdx*3 + i)*2] = values[0];
            this._geometry.translate[(faceIdx*3 + i)*2 + 1] = values[1];
        }
    }

}