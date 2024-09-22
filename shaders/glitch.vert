attribute vec3 aPosition;
attribute float aCopyValue;
attribute vec2 aTranslate;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec2 vPos;
varying float vCopyValue;
varying vec2 vTranslate;

void main ()
{
	vec4 positionVec4 = vec4( aPosition , 1.0 );
    positionVec4 = uProjectionMatrix * uModelViewMatrix * positionVec4;
    gl_Position = positionVec4;

    vPos = aPosition.xy;
    vCopyValue = aCopyValue;
    vTranslate = aTranslate;
}