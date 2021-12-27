precision highp float;
precision highp int;

//struct PointLight {
//    vec3 color;
//    vec3 position; // light position, in camera coordinates
//    float distance; // used for attenuation purposes.
//    float intensity;
//};
//uniform PointLight pointLights[NUM_POINT_LIGHTS];
uniform vec4 MainColor;
uniform vec4 SecondColor;
varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

void main() {
    vColor = vec4(color.xyz,1.0);
    vPosition = modelViewMatrix * vec4(position.xyz, 1.0);
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz , 1.0);
}
