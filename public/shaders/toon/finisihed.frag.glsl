precision highp float;
precision highp int;

struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes.
    float intensity;
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];
uniform vec4 mainColor;
uniform mat4 modelViewMatrix;
uniform float exposure;
uniform float specularCutoff;
uniform float inkingCutoff;
varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

void main()	{
    vec3 N = normalize(vNormal);
    vec3 position = vPosition.xyz;
    vec4 lightPosition = viewMatrix*vec4(pointLights[0].position.xyz,1.0);

    // just the camera
    //    vec3 cameraViewPosition = (viewMatrix*vec4(cameraPosition,1.0)).xyz;

    vec3 pToL = lightPosition.xyz-vPosition.xyz;
    vec3 L = normalize(pToL);

    vec3 vertexToEye = normalize(-position);
    vec3 lightReflect = normalize(reflect(-L,N));
    float diffuse = dot(L,N)+0.1;
    float specular = dot(vertexToEye, lightReflect);
    vec3 surface_color = vColor.xyz;

    float dist = length(pToL);
    //    float falloff = 100.0/(pow(0.1*dist,2.0));
    float falloff = 1000.0/dist;
    float alpha = 1.0;
    vec4 standardLighting = vec4(exposure*diffuse*falloff*surface_color, alpha);
    float standardLen = length(standardLighting.xyz);
    vec3 standardNorm = normalize(standardLighting.xyz);
    vec3 toon = vec3(0.0,0.0,0.0);

    vec4 thresholds = vec4(0.9,0.7,0.4,0.2);
    vec4 clampVals = vec4(1.2,0.8,0.5,0.25);

    if(standardLen>thresholds.x){
        toon = standardNorm*clampVals.x;
    }else if(standardLen>thresholds.y){
        toon = standardNorm*clampVals.y;
    }else if(standardLen>thresholds.z){
        toon = standardNorm*clampVals.z;
    }else if(standardLen>thresholds.w){
        toon = standardNorm*clampVals.w;
    }else{
        toon = standardNorm*0.1;
    }

    // black outline
    if(dot(N, vec3(0,0,1))<inkingCutoff){
        toon = vec3(0.0,0.0,0.0);
    }

    //    // specularity
    if(specular>specularCutoff){
        toon = vec3(1.0,1.0,1.0);
    }

    gl_FragColor = vec4(toon,1.0);

}
