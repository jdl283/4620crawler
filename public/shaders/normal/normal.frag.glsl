precision highp float;
precision highp int;

struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes.
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];
//varying vec4 vPosition;
//varying vec4 vColor;
varying vec3 vNormal;

void main()	{
    gl_FragColor = vec4(vNormal, 1);
}
