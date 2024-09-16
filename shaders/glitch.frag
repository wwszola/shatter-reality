precision highp float;

uniform sampler2D uInputTex;
uniform sampler2D uPrevTex;

varying vec2 vPos;
varying float vCopyValue;

void main (){
    vec4 color = texture2D(uInputTex, vPos);
    if(vCopyValue < 0.5)
        color = texture2D(uPrevTex, vPos);
    gl_FragColor = color;
}