import * as THREE from "three";
import {ASerializable} from "../../aserial";
import {AObject, AObjectState} from "../../aobject";

export enum AShaderManagerEnums{
    SHADER_DIRECTORY_URL='shaders/',
    DEFAULT_SHADER='basic'
}


export class ShaderProgramSource extends AObject{
    public name: string;
    public vertexURL: string;
    public fragURL: string;
    @AObjectState vertexSource!: string;
    @AObjectState fragSource!: string;
    public sourcesLoadedPromise:Promise<this>;

    constructor(name: string, vertexURL: string, fragURL: string) {
        super();
        this.name = name;
        this.vertexURL = vertexURL;
        this.fragURL = fragURL;
        const self = this;
        async function loadSources(){
            self.vertexSource = (await ShaderProgramSource.LoadShaderFile(vertexURL)) as string;
            self.fragSource = (await ShaderProgramSource.LoadShaderFile(fragURL)) as string;
            return self;
        };
        this.sourcesLoadedPromise = loadSources();
        // this.sourcesLoadedPromise = new Promise(function (myResolve, myReject){
        //     self.vertexSource = (ShaderProgramSource.LoadShaderFile(vertexURL)) as string;
        //     self.fragSource = (ShaderProgramSource.LoadShaderFile(fragURL)) as string;
        //     myResolve();
        // });
        // this.sourcesLoadedPromise = loadSources();
    }

    static LoadShaderFile(sourceURL: string) {
        let shaderLoader = new THREE.FileLoader();
        let shaderSource = shaderLoader.loadAsync(
            sourceURL,
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
        return shaderSource;
    }
}

@ASerializable("ShaderSourceManager")
class AShaderSourceManager extends AObject{
    @AObjectState _shaderSources!:{[name:string]:ShaderProgramSource}
    _shaderPromises:{[name:string]:Promise<ShaderProgramSource>}={};
    constructor() {
        super();
        this._shaderSources={};
    }

    static GetURLForShaderAtPath(path:string){
        return AShaderManagerEnums.SHADER_DIRECTORY_URL+path;
    }

    LoadShader(name:string, vertexPath:string, fragPath:string){
        const self=this;
        this._shaderPromises[name]=new Promise<ShaderProgramSource>(function(myResolve, myReject){
            let newSource =
                new ShaderProgramSource(
                    name,
                    AShaderSourceManager.GetURLForShaderAtPath(vertexPath),
                    AShaderSourceManager.GetURLForShaderAtPath(fragPath)
                );
            newSource.sourcesLoadedPromise.then(
                function(value){
                    self._shaderSources[name]=value;
                }
            );
            self._shaderSources[name]=newSource;
            myResolve(newSource);
        })
        return this._shaderPromises[name];
        // assert(this._shaderSources[name] === undefined, `Tried to re-load shader ${name} with V:${vertexPath} F:${fragPath}`);
    }

    GetShaderSource(name:string){
        return this._shaderSources[name];
    }
}


const ShaderManager = new AShaderSourceManager();
ShaderManager.LoadShader('example2', 'example2/example2.vert.glsl', 'example2/example2.frag.glsl');
ShaderManager.LoadShader('normal', 'normal/normal.vert.glsl', 'normal/normal.frag.glsl');


export {ShaderManager};
