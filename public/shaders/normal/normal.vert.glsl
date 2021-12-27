precision highp float;
precision highp int;

struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes.
};

// varying vec3 color
// varying vec3 position



uniform PointLight pointLights[NUM_POINT_LIGHTS];
//varying vec4 vPosition;
//varying vec4 vColor;
varying vec3 vNormal;
void main() {
//    vColor = vec4(pointLights[0].color.xyz, 1);
//    vPosition = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    vNormal = vec3(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz , 1.0);

}
