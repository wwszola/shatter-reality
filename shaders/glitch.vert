attribute vec3 aPosition;
attribute float aCopyValue;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec2 vPos;
varying float vCopyValue;

void main ()
{
	vec4 positionVec4 = vec4( aPosition , 1.0 );
    positionVec4 = uProjectionMatrix * uModelViewMatrix * positionVec4;
    gl_Position = positionVec4;

    vPos = aPosition.xy;
    vCopyValue = aCopyValue;
}