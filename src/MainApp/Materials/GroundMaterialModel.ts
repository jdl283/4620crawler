import {ASerializable, AShaderMaterial, AShaderModel, AShaderModelBase, Color, ShaderManager} from "../../anigraph";
import {ATexture} from "../../anigraph/arender/ATexture";
import * as THREE from "three";
let GroundShaderPromise = ShaderManager.LoadShader('ground', 'ground/ground.vert.glsl', 'ground/ground.frag.glsl');


@ASerializable("GroundMaterialModel")
export class GroundMaterialModel extends AShaderModel{
    static ShaderPromise = GroundShaderPromise;
    textureName:string;
    constructor(texture?:string|ATexture) {
        super("ground");
        if(texture instanceof ATexture){
            this.setTexture('color', texture);
            this.textureName = texture.name;
        }else{
            let textureName = texture??'marble.jpg';
            this.textureName=textureName;
            this.setTexture('color', './images/'+this.textureName);
        }
    }

    setTexture(name: string, texture?: ATexture | string) {
        super.setTexture(name, texture);
    }

    CreateMaterial(){
        let mat = super.CreateMaterial();
        mat.setUniform('ambient', 0.6);
        mat.setUniform('exposure', 1.0);
        mat.setUniform('specularExp', 20);
        mat.setUniform('specular', 1.0);
        mat.setUniform('diffuse', 1.0);
        // mat.setTexture('color', './images/'+this.textureName);
        mat.setTexture('color', this.getTexture('color'));
        mat.setTexture('normal', this.getTexture('normal'));
        return mat;
    }

    getMaterialGUIParams(material:AShaderMaterial){
        const self = this;
        return {
            ...AShaderModelBase.ShaderUniformGUIColorControl(material, 'modelColor'),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'specular', 1.0, {
                min:0,
                max:5,
                step:0.01
            }),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'specularExp', 10, {
                min:0,
                max:100,
                step:0.01
            }),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'diffuse', 1.0, {
                min:0,
                max:5,
                step:0.01
            }),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'ambient', 1.0, {
                min:0,
                max:2,
                step:0.01
            }),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'exposure', 1, {
                min:0,
                max:20,
                step:0.01
            }),
            ...AShaderModelBase.ShaderTextureGUIUpload(material, 'color'),
        }
    }


    _CreateTHREEJS(){
        let uniforms = {uniforms:THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {...this.uniforms}
            ])};
        return new this.materialClass({
            vertexShader: this.vertexSource,
            fragmentShader: this.fragSource,
            vertexColors: true,
            ...this.settingArgs,
            ...this.defaults,
            ...uniforms,
            ...this.sharedParameters,
        });
    }

}
