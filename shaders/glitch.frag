precision highp float;

uniform sampler2D uInputTex;
uniform sampler2D uPrevTex;

varying vec2 vPos;
varying float vCopyValue;

void main (){
    vec2 uv = vPos;
    vec4 color = texture2D(uInputTex, uv);
    if(vCopyValue < 0.5)
        color = texture2D(uPrevTex, uv);
    gl_FragColor = color;
}