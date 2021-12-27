import {Color} from "../../amath";
import {Object3DModelWrapper} from "../../ageometry";
import {ATriangleMeshElement} from "../basic/ATriangleMeshElement";
import {ALoadedElementInterface} from "./ALoadedElement";
import {AMaterial} from "../../amvc/material/AMaterial";
import * as THREE from "three";


export class ALoadedBoundsElement extends ATriangleMeshElement implements ALoadedElementInterface{
    public _sourceObject:Object3DModelWrapper
    constructor(object:Object3DModelWrapper) {
        super();
        // this.setVerts(object.getBoundingBoxVertexArray());
        this._sourceObject=object;
        let verts = this._sourceObject.getBoundingBoxVertexArray()
        this.setGeometry(verts);
        this.setMaterial(Color.Random());
    }

    onModelColorChange(color:Color){
        this.setMaterial(color);
    }

    onMaterialChange(newMaterial:AMaterial){
        // this.setMaterial(newMaterial.threejs);
    }
    onMaterialUpdate(newMaterial: AMaterial, ...args:any[]) {
        // super.onMaterialUpdate(newMaterial, ...args);
        // if('color' in this._element.material){
        //     // @ts-ignore
        //     this._element.material.color = newMaterial.getColor();
        // }
    }

    updateSourceTransform(){
        this.setVerts(this._sourceObject.getBoundingBoxVertexArray());
    }
}

