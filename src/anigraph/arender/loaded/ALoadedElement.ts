import {ARenderGroup} from "../ARenderGroup";
import {Color} from "../../amath";
import {Object3DModelWrapper} from "../../ageometry";
import {AMaterial} from "../../amvc/material/AMaterial";
import * as THREE from "three";
import {ASerializable} from "../../aserial";


export interface ALoadedElementInterface{
    updateSourceTransform():void;
}

@ASerializable("ALoadedElement")
export class ALoadedElement extends ARenderGroup implements ALoadedElementInterface{
    public _sourceObject:Object3DModelWrapper
    public loadedObject:THREE.Object3D;
    constructor(object:Object3DModelWrapper) {
        super();
        this.loadedObject= object.getNewSceneObject();
        this.threejs.add(this.loadedObject);
        this._sourceObject=object;
    }

    setMaterial(material:Color|THREE.Color|THREE.Material|THREE.Material[]){
        if(this.loadedObject instanceof THREE.Mesh && this.loadedObject.material instanceof THREE.Material){
            this.loadedObject.material = material;
        }
    }

    onMaterialChange(newMaterial:AMaterial){
        this.setMaterial(newMaterial.threejs);
    }
    onMaterialUpdate(newMaterial: AMaterial, ...args:any[]) {
        super.onMaterialUpdate(newMaterial, ...args);
    }

    updateSourceTransform(){
        this._sourceObject.sourceTransform.getMatrix().assignTo(this.loadedObject.matrix);
    }
}

