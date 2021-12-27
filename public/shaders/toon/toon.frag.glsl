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
uniform float ambient;
uniform float diffuse;
uniform float specular;
uniform float specularExp;

uniform float specularCutoff;
uniform float inkingCutoff;

uniform float TOON;

varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;


void main()	{

    vec3 N = normalize(vNormal);
    vec3 position = vPosition.xyz/vPosition.w;
    vec3 surface_color = vColor.xyz;
    float alpha = vColor.w;
    vec3 diffuseLighting = vec3(0.0,0.0,0.0);
    vec3 specularLighting = vec3(0.0,0.0,0.0);
    float specularStrength = 0.0;
    if(NUM_POINT_LIGHTS>0){
        for (int plight=0;plight<int(NUM_POINT_LIGHTS);++plight){
            vec4 lightPosition = vec4(pointLights[plight].position, 1.0);
            vec3 lightColor = pointLights[plight].color;
            vec3 pToL = lightPosition.xyz-vPosition.xyz;
            vec3 L = normalize(pToL);
            vec3 vertexToEye = normalize(-position);
            vec3 lightReflect = normalize(reflect(-L, N));
            float specularFactor = max(dot(vertexToEye, lightReflect), 0.0);
            specularStrength = specularStrength+pow(specularFactor, specularExp);
            float diffuseStrength = max(dot(L, N), 0.0);
            float dist = length(pToL);
            float falloff = 100.0/dist;
            diffuseLighting = diffuseLighting+diffuseStrength*falloff*surface_color*lightColor;
            specularLighting = specularLighting+specularStrength*falloff*surface_color*lightColor;
        }
    }
    //    gl_FragColor = vec4(ones*exposure*falloff, 1.0);
    vec3 lighting = diffuseLighting*diffuse+specularLighting*specular + vec3(ambient, ambient,ambient);
    vec4 standardLighting = vec4(lighting*exposure*surface_color,1.0);

    vec3 standardNorm = normalize(standardLighting.xyz);
    float standardLen = length(standardLighting.xyz);

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

//     Specular highlight
    if(specularStrength>specularCutoff){
        toon = vec3(1.0,1.0,1.0);
    }

    gl_FragColor = vec4(TOON*toon + (1.0-TOON)*standardLighting.xyz, alpha);
//    gl_FragColor = vec4(toon,1.0);
//    gl_FragColor = standardLighting;

}
