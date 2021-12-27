import {AObject} from "../aobject";
import {ATexture} from "./ATexture";
import {AShaderModel, ShaderUniformDict} from "../amvc";
import {TextureKeyForName, TextureProvidedKeyForName} from "../basictypes";

interface HasUniforms{
    uniforms:ShaderUniformDict;
}

export class ATextureDict extends AObject{
    public textures:{[name:string]:ATexture|undefined}={};
    // public uniforms!:ShaderUniformDict|undefined;
    owner:HasUniforms;

    get uniforms(){
        return this.owner.uniforms;
    }
    constructor(owner:HasUniforms) {
        super();
        this.owner = owner;
    }

    setTexture(name:string, texture?:ATexture|string){
        if(texture) {
            if (texture instanceof ATexture) {
                this.textures[name] = texture;
            } else {
                this.textures[name] = new ATexture(texture);
            }
            // @ts-ignore
            this.setUniform(TextureKeyForName(name), this.getTexture(name).threejs, 't');
            this.setUniform(TextureProvidedKeyForName(name), !!this.getTexture(name), 'bool');
        }else if(texture===undefined){
            this.textures[name] = texture;
            this.setUniform(TextureKeyForName(name), null, 't');
            this.setUniform(TextureProvidedKeyForName(name), false, 'bool');
        }
    }

    // setUniformsDict(uniforms:ShaderUniformDict){
    //     this.uniforms = uniforms;
    // }

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
    }

    getUniformValue(name:string) {
        if(!this.uniforms){return;}
        let uniform = this.uniforms[name];
        return uniform?.value;
    }

    addTexturesFromTextureDict(textureDict:ATextureDict){
        for(let t in textureDict.textures){
            // this.textures[t] = textureDict.textures[t]
            this.setTexture(t, textureDict.getTexture(t));
        }
    }

}
