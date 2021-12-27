import {AMaterial} from "./AMaterial";
import {ATexture} from "../../arender/ATexture";
import {AObjectState} from "../../aobject";
import {AShaderModel, ShaderUniformDict} from "./AShaderModel";
import * as THREE from "three";
import {Color, Vec3, Vec4} from "../../amath";
import {TextureKeyForName, TextureProvidedKeyForName} from "../../basictypes";

export class AShaderMaterial extends AMaterial{
    @AObjectState uniforms!:ShaderUniformDict;
    get threejs():THREE.ShaderMaterial{
        return this._material as THREE.ShaderMaterial;
    }



    getUniformValue(name:string) {
        let uniform = this.uniforms[name];
        return uniform?.value;
    }

    setModelColor(v:Color|THREE.Color){
        this.setUniformColor('modelColor', v);
    }

    setValue(name:string, value:any){
        let vals:{[name:string]:any}={};
        vals[name]=value;
        this.setValues(vals);
    }


    getModelColor(){
        let c = this.getUniformValue('modelColor');
        if(c){
            return Color.FromThreeJS(c);
        }else{
            return Color.FromString("#77bb77");
        }
    }

    public textures:{[name:string]:ATexture|undefined}={};
    get model():AShaderModel{
        return this._model as AShaderModel;
    }

    constructor(...args:any[]) {
        super(...args);
        this.uniforms = {};
    }

    setModel(model: AShaderModel) {
        super.setModel(model);
        this.loadTexturesFromShaderModel(model);
    }


    loadTexturesFromShaderModel(model?:AShaderModel){
        let shader = model??this.model;
        for(let t in shader.textures){
            this.textures[t]=shader.textures[t];
        }
    }

    //##################//--Uniforms--\\##################
    //<editor-fold desc="Uniforms">
    setUniformsDict(uniforms:ShaderUniformDict){
        this.uniforms = uniforms;
    }

    setUniforms(uniforms:ShaderUniformDict){
        if(!this.uniforms){
            this.uniforms = {};
        }
        for (let u in uniforms){
            // @ts-ignore
            this.setUniform(u, uniforms[u].value, uniforms[u].type);
        }
    }

    setTexture(name:string, texture?:ATexture|string){
        if(texture) {
            if (texture instanceof ATexture) {
                this.textures[name] = texture;
            } else {
                this.textures[name] = new ATexture(texture);
            }
            this.setUniform(TextureKeyForName(name), this.getTexture(name)?.threejs, 't');
            this.setUniform(TextureProvidedKeyForName(name), !!this.getTexture(name), 'bool');
        }else if(texture===undefined){
            this.textures[name] = texture;
            this.setUniform(TextureKeyForName(name), null, 't');
            this.setUniform(TextureProvidedKeyForName(name), false, 'bool');
        }
    }

    getTexture(name:string){
        return this.textures[name];
    }

    setUniform(name:string, value:any, type?:string) {
        let uval: { [name: string]: any } = {value:value};
        if (type !== undefined) {
            uval['type'] = type;
        }
        // @ts-ignore
        this.uniforms[name] = uval;
        if(this.threejs){
            // @ts-ignore
            this.threejs.uniforms[name] = uval;
        }
    }

    setUniform3fv(name:string, value:Vec3) {
        this.setUniform(name, value.asThreeJS(), 'vec3');
    }

    setUniform4fv(name:string, value:Vec4) {
        this.setUniform(name, value.asThreeJS(), 'vec4');
    }

    setUniformColor(name:string, value:Color|THREE.Color, alpha:number=1){
        if(value instanceof THREE.Color){
            this.setUniform(name, value, 'vec4');
        }else{
            this.setUniform(name, value.Vec4.asThreeJS(), 'vec4');
        }

    }

    //</editor-fold>
    //##################\\--Uniforms--//##################

    // initMaterial(parameters?:MaterialParameters){
    //     let params = {uniforms:this.uniforms};
    //     if(parameters!==undefined){
    //         params = {...params, ...parameters};
    //     }
    //     // this._shaderSource.sourcesLoadedPromise;
    //     this._material = new THREE.ShaderMaterial({
    //             vertexShader:this.model.vertexSource,
    //             fragmentShader:this.model.fragSource,
    //             transparent: true,
    //             lights:true,
    //             ...parameters
    //         }
    //     )
    // }

    // async initMaterialAsync(parameters?:MaterialParameters){
    //     const self = this;
    //     this.model.sourcesLoadedPromise.then(()=>{self.initMaterial();});
    // }

}
