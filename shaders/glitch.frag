precision highp float;

uniform sampler2D uInputTex;
uniform sampler2D uPrevTex;

varying vec2 vPos;
varying float vCopyValue;
varying vec2 vTranslate;


mat3 constructTranslation(vec2 v){
    return mat3(
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        v.x, v.y, 1.0
    );
}

mat3 constructRotation(float a){
    float s = sin(a);
    float c = cos(a);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

mat3 constructScale(vec2 v){
    return mat3(
        v.x, 0.0, 0.0,
        0.0, v.y, 0.0,
        0.0, 0.0, 1.0
    );
}

mat3 constructShear(vec2 v){
    return mat3(
        1.0, v.y, 0.0,
        v.x, 1.0, 0.0,
        0.0, 0.0, 1.0
    );
}

void main (){
    vec2 uv = vPos;
    vec3 p = vec3(uv.x, uv.y, 1.0);
    mat3 transform = constructTranslation(vTranslate);
    
    // p.xy -= vec2(0.5, 0.5);
    p = transform * p;
    // p.xy += vec2(0.5, 0.5);

    p = clamp(p, 0.0, 1.0);

    vec4 color = texture2D(uInputTex, p.xy);
    if(vCopyValue < 0.3)
        color = texture2D(uPrevTex, p.xy);
    gl_FragColor = color;

}