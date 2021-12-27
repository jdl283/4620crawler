import * as THREE from "three";
import {ARenderElement} from "../ARenderElement";
import {Color} from "../../amath";
import {ASerializable} from "../../aserial";

@ASerializable("ASphereElement")
export default class ASphereElement extends ARenderElement{

    get geometry(){return this._geometry;}


    constructor(radius:number=100,
                material?:Color|THREE.Color|THREE.Material|THREE.Material[],
                ...args:any[]){
        super(new THREE.SphereBufferGeometry(radius, 100, 100), material, ...args);
    }
}
