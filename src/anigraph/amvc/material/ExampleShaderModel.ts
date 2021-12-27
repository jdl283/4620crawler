import {ShaderManager} from "./AShaderManager";
import {AShaderModel, AShaderModelBase} from "./AShaderModel";
import {ATexture} from "../../arender/ATexture";
import {ASerializable} from "../../aserial";
import {Color} from "../../amath";
import {AShaderMaterial} from "./AShaderMaterial";
import * as THREE from "three";

ShaderManager.LoadShader('example1', 'example1/example1.vert.glsl', 'example1/example1.frag.glsl');

@ASerializable("ExampleShaderModel")
export class ExampleShaderModel extends AShaderModel{
    constructor() {
        super('example1');
    }

    CreateMaterial(){
        let mat = super.CreateMaterial();
        mat.setUniform('ambient', 0.1);
        mat.setUniform('exposure', 1.0);
        mat.setUniform('specularExp', 10);
        mat.setUniform('specular', 1.0);
        mat.setUniform('diffuse', 1.0);
        mat.setUniformColor('mainColor', Color.FromString("#aaaaaa"))
        mat.setTexture('texmap','trippy.jpeg')
        return mat;
    }

    getMaterialGUIParams(material:AShaderMaterial){
        return {
            ...this.getTextureGUIParams(material), // this will add buttons for loading any textures you've defined
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'specularExp', 10, {
                min:0,
                max:100,
                step:0.01
            }),
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'specular', 1.0, {
                min:0,
                max:5,
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



