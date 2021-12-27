import * as THREE from "three";
import {AObject, AObjectState} from "../aobject";
import {ASerializable} from "../aserial";
import {GenericDict} from "../basictypes";

// // http://stackoverflow.com/a/14855016/2207790
// var loadTextureHTTP = function (url, callback) {
//     require('request')({
//         method: 'GET', url: url, encoding: null
//     }, function(error, response, body) {
//         if(error) throw error;
//
//         var image = new Image;
//         image.src = body;
//
//         var texture = new THREE.Texture(image);
//         texture.needsUpdate = true;
//
//         if (callback) callback(texture);
//     });
// };

@ASerializable("ATexture")
export class ATexture extends AObject{
    @AObjectState name!:string;
    @AObjectState _url!:string;
    @AObjectState _texdata:GenericDict;
    public threejs!:THREE.Texture;

    get width():number{
        let w = this.getTexData('width');
        return (w!==undefined)?w:this.threejs.image.width;
    }
    get height():number{
        let w = this.getTexData('height');
        return (w!==undefined)?w:this.threejs.image.height;
    }

    static async LoadAsync(texturePath:string, name?:string){
        let threetexture = await new THREE.TextureLoader().loadAsync(texturePath,
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
        return new ATexture(threetexture, name);
    }

    constructor(texture?:string|THREE.Texture, name?:string) {
        super();
        this._texdata = {};
        if(texture instanceof THREE.Texture) {
            this._setTHREETexture(texture);
        }else{
            this.loadFromURL(texture as string);
        }
        if(name){
            this.name=name;
        }else{
            this.name = this.threejs.name;
        }
        this.setWrapToRepeat();
    }

    _setTHREETexture(tex:THREE.Texture){
        this.threejs=tex;
    }
    setTexData(key:string, value:any){
        this._texdata[key]=value;
    }
    getTexData(key:string){
        return this._texdata[key];
    }

    loadFromURL(url:string){
        this._url = url;
        this.threejs = new THREE.TextureLoader().load(this._url);
        this.setTexData('url', url);
    }

    setWrapToRepeat(repeats?:number|number[]){
        this.threejs.wrapS=THREE.RepeatWrapping;
        this.threejs.wrapT=THREE.RepeatWrapping;
        if(repeats!==undefined) {
            if (Array.isArray(repeats)) {
                this.threejs.repeat.set(repeats[0], repeats[1]);
            } else {
                this.threejs.repeat.set(repeats, repeats);
            }
        }
    }
    setWrapToClamp(){
        this.threejs.wrapS=THREE.ClampToEdgeWrapping;
        this.threejs.wrapT=THREE.ClampToEdgeWrapping;
    }
}
